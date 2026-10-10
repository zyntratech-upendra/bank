import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, MapPin, Coins, Filter, X, ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit2, Trash2
} from 'lucide-react';
import api from '../../../utils/api';

const BankRatesView = (props) => {
  const {
    showToast,
    bankRatesList = [],
    setEditingBankRate,
    setShowBankRateModal,
    setBankRatesList
  } = props;

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedBank, setSelectedBank] = useState('All');
  const [sortBy, setSortBy] = useState('default'); // 'default', 'rate-desc', 'rate-asc', 'interest-asc', 'interest-desc'
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Extract unique cities and banks for filters
  const cities = useMemo(() => {
    const set = new Set();
    bankRatesList.forEach(r => {
      if (r.cityName) set.add(r.cityName.trim());
    });
    return Array.from(set).sort();
  }, [bankRatesList]);

  const banks = useMemo(() => {
    const set = new Set();
    bankRatesList.forEach(r => {
      if (r.bankName) set.add(r.bankName.trim());
    });
    return Array.from(set).sort();
  }, [bankRatesList]);

  // Filtered & Sorted list
  const filteredRates = useMemo(() => {
    let list = [...bankRatesList];

    // City filter
    if (selectedCity !== 'All') {
      list = list.filter(r => (r.cityName || '').toLowerCase() === selectedCity.toLowerCase());
    }

    // Bank filter
    if (selectedBank !== 'All') {
      list = list.filter(r => (r.bankName || '').toLowerCase() === selectedBank.toLowerCase());
    }

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(r => 
        (r.cityName && r.cityName.toLowerCase().includes(q)) ||
        (r.bankName && r.bankName.toLowerCase().includes(q)) ||
        (r.branchName && r.branchName.toLowerCase().includes(q)) ||
        (r.goldRatePerGram && String(r.goldRatePerGram).includes(q)) ||
        (r.interestRate && String(r.interestRate).includes(q))
      );
    }

    // Sorting
    if (sortBy === 'rate-desc') {
      list.sort((a, b) => Number(b.goldRatePerGram || 0) - Number(a.goldRatePerGram || 0));
    } else if (sortBy === 'rate-asc') {
      list.sort((a, b) => Number(a.goldRatePerGram || 0) - Number(b.goldRatePerGram || 0));
    } else if (sortBy === 'interest-asc') {
      list.sort((a, b) => Number(a.interestRate || 0) - Number(b.interestRate || 0));
    } else if (sortBy === 'interest-desc') {
      list.sort((a, b) => Number(b.interestRate || 0) - Number(a.interestRate || 0));
    }

    return list;
  }, [bankRatesList, selectedCity, selectedBank, searchTerm, sortBy]);

  // Reset to page 1 whenever filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCity, selectedBank, sortBy, pageSize]);

  // Pagination calculation
  const totalEntries = filteredRates.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const validPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalEntries);
  const paginatedRates = filteredRates.slice(startIndex, endIndex);

  // Pagination helpers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, validPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  const hasActiveFilters = searchTerm !== '' || selectedCity !== 'All' || selectedBank !== 'All' || sortBy !== 'default';

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCity('All');
    setSelectedBank('All');
    setSortBy('default');
  };

  return (
    <div className="space-y-6 font-sans antialiased text-slate-800">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Bank Gold Rates
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Compare and manage live gold loan rates across different partner banks and cities.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setEditingBankRate(null); setShowBankRateModal(true); }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Coins size={18} className="stroke-[2.5]" />
            <span>Add Gold Loan Rate</span>
          </button>
        </div>
      </div>

      {/* Control / Filter Bar */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5 transition-all">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
          {/* Search Box */}
          <div className="lg:col-span-4 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search bank, city, branch, rate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* City Filter */}
          <div className="lg:col-span-3">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              aria-label="Filter by City"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="All">All Cities ({cities.length})</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Bank Filter */}
          <div className="lg:col-span-3">
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              aria-label="Filter by Bank"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="All">All Banks ({banks.length})</option>
              {banks.map((bank) => (
                <option key={bank} value={bank}>{bank}</option>
              ))}
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="lg:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort Bank Rates"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="default">Sort by: Default</option>
              <option value="rate-desc">Highest Rate / Gram</option>
              <option value="rate-asc">Lowest Rate / Gram</option>
              <option value="interest-asc">Lowest Interest (p.a.)</option>
              <option value="interest-desc">Highest Interest (p.a.)</option>
            </select>
          </div>
        </div>

        {/* Filter Summary & Quick Reset */}
        {hasActiveFilters && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <Filter size={14} className="text-blue-600" />
              <span>
                Found <strong className="text-slate-900 font-bold">{filteredRates.length}</strong> matching results
              </span>
            </div>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-semibold hover:underline cursor-pointer"
            >
              <X size={13} />
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Responsive Table for Tablet & Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm font-medium">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                <th className="py-4 px-6">City</th>
                <th className="py-4 px-6">Bank & Branch</th>
                <th className="py-4 px-6">Gold Loan Rate Per Gram</th>
                <th className="py-4 px-6">Interest Rate</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRates.map((rate, i) => (
                <tr key={rate._id || rate.id || i} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                        <MapPin size={16} />
                      </div>
                      <span className="font-bold text-slate-900 text-sm">{rate.cityName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 text-sm capitalize">{rate.bankName}</span>
                      <span className="text-xs text-slate-500 capitalize">{rate.branchName || 'Main Branch'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-extrabold text-blue-600 text-base tracking-tight font-display">
                      ₹{Number(rate.goldRatePerGram || 0).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal ml-1">/ gram</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-bold text-xs">
                      {rate.interestRate}% <span className="text-[10px] text-emerald-600/80 font-semibold">p.a.</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => { setEditingBankRate(rate); setShowBankRateModal(true); }}
                        className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl font-bold transition-all hover:scale-105 cursor-pointer"
                        title="Edit Rate"
                        aria-label="Edit Rate"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button 
                        onClick={async () => {
                          if (window.confirm(`Delete bank rate for ${rate.bankName} (${rate.cityName})?`)) {
                            try {
                              await api.delete(`/admin/bank-rates/${rate._id || rate.id}`);
                              setBankRatesList(prev => prev.filter(r => (r._id || r.id) !== (rate._id || rate.id)));
                              showToast('Bank rate deleted successfully!');
                            } catch (err) {
                              console.error(err);
                              showToast('Error deleting bank rate.');
                            }
                          }
                        }}
                        className="p-2 text-rose-500 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl font-bold transition-all hover:scale-105 cursor-pointer"
                        title="Delete Rate"
                        aria-label="Delete Rate"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredRates.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-16 px-6 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-3 text-slate-400">
                        <Coins size={28} />
                      </div>
                      <h3 className="text-base font-bold text-slate-800">No Bank Rates Found</h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm">
                        {hasActiveFilters ? "No gold rates match your selected filters. Try resetting the filters." : "No gold rates in database yet. Add one using the button above."}
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={resetFilters}
                          className="mt-4 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View (Optimized for Small Screens) */}
        <div className="block md:hidden divide-y divide-slate-100">
          {paginatedRates.map((rate, i) => (
            <div key={rate._id || rate.id || i} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm capitalize">{rate.bankName}</h4>
                    <p className="text-xs text-slate-500">{rate.cityName} • {rate.branchName || 'Main'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button 
                    onClick={() => { setEditingBankRate(rate); setShowBankRateModal(true); }}
                    className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-bold"
                    title="Edit Rate"
                    aria-label="Edit Rate"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={async () => {
                      if (window.confirm(`Delete bank rate for ${rate.bankName}?`)) {
                        try {
                          await api.delete(`/admin/bank-rates/${rate._id || rate.id}`);
                          setBankRatesList(prev => prev.filter(r => (r._id || r.id) !== (rate._id || rate.id)));
                          showToast('Bank rate deleted successfully!');
                        } catch (err) {
                          console.error(err);
                          showToast('Error deleting bank rate.');
                        }
                      }
                    }}
                    className="p-1.5 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-lg font-bold"
                    title="Delete Rate"
                    aria-label="Delete Rate"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Rate per gram</span>
                  <span className="font-black text-blue-600 text-base font-display">
                    ₹{Number(rate.goldRatePerGram || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Interest rate</span>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-bold text-xs">
                    {rate.interestRate}% <span className="text-[10px] text-emerald-600">p.a.</span>
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filteredRates.length === 0 && (
            <div className="py-12 px-4 text-center">
              <Coins size={28} className="mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-semibold text-slate-600">No bank rates found</p>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="mt-3 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination Section */}
        {totalEntries > 0 && (
          <div className="border-t border-slate-200/80 px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
            {/* Entry Count & Page Size Selector */}
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
              <span>
                Showing <strong className="text-slate-800 font-bold">{startIndex + 1}</strong> to <strong className="text-slate-800 font-bold">{endIndex}</strong> of <strong className="text-slate-800 font-bold">{totalEntries}</strong> entries
              </span>
              <div className="hidden sm:flex items-center gap-1.5 ml-2 border-l border-slate-200 pl-3">
                <span>Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  aria-label="Rows per page"
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                {/* First Page */}
                <button 
                  onClick={() => setCurrentPage(1)}
                  disabled={validPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="First Page"
                  aria-label="First Page"
                >
                  <ChevronsLeft size={16} />
                </button>

                {/* Previous Page */}
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={validPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Previous Page"
                  aria-label="Previous Page"
                >
                  <ChevronLeft size={16} />
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`min-w-8 h-8 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      validPage === pageNum 
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                {/* Next Page */}
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={validPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Next Page"
                  aria-label="Next Page"
                >
                  <ChevronRight size={16} />
                </button>

                {/* Last Page */}
                <button 
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={validPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Last Page"
                  aria-label="Last Page"
                >
                  <ChevronsRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BankRatesView;
