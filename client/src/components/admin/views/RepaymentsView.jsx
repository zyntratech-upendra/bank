import React, { useState } from 'react';
import { 
  Plus, Search, Download, ArrowUpRight, ArrowDownLeft, Receipt, 
  Trash2, Eye, Printer, CheckCircle, Calendar, CreditCard, User, 
  FileText, IndianRupee, ShieldCheck, X
} from 'lucide-react';
import api from '../../../utils/api';

const RepaymentsView = (props) => {
  const { applications, customersList, showToast } = props;

  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, GIVEN, TAKEN
  const [showModal, setShowModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Form State
  const [form, setForm] = useState({
    type: 'TAKEN', // TAKEN (Payment Received) or GIVEN (Disbursement/Money Given)
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    loanId: '',
    amount: '',
    paymentMode: 'Bank Transfer (NEFT/RTGS)',
    transactionReference: '',
    paymentDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    notes: ''
  });

  // Fetch receipts from backend
  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/payments');
      setReceipts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchReceipts();
  }, []);

  // Handle Form Submit
  const handleCreateReceipt = async (e) => {
    e.preventDefault();
    if (!form.customerName || !form.amount) {
      showToast('Please enter customer name and payment amount');
      return;
    }

    try {
      const res = await api.post('/admin/payments', form);
      const data = res.data;
      setReceipts(prev => [data.receipt, ...prev]);
      showToast(`Receipt ${data.receipt.receiptNumber} recorded successfully!`);
      setShowModal(false);
      setForm({
        type: 'TAKEN',
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        loanId: '',
        amount: '',
        paymentMode: 'Bank Transfer (NEFT/RTGS)',
        transactionReference: '',
        paymentDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        notes: ''
      });
    } catch (err) {
      console.error(err);
      showToast('Error recording payment');
    }
  };

  // Delete Receipt
  const handleDeleteReceipt = async (id, num) => {
    if (!window.confirm(`Delete payment record ${num}?`)) return;
    try {
      await api.delete(`/admin/payments/${id}`);
      setReceipts(prev => prev.filter(r => r._id !== id));
      showToast(`Receipt ${num} removed`);
    } catch (err) {
      console.error(err);
      showToast('Failed to delete payment');
    }
  };

  // Pre-fill customer from dropdown selection
  const handleSelectCustomer = (e) => {
    const custId = e.target.value;
    if (!custId) return;
    const cust = (customersList || []).find(c => (c._id || c.id) === custId);
    if (cust) {
      setForm(prev => ({
        ...prev,
        customerName: cust.name || '',
        customerPhone: cust.phone || '',
        customerEmail: cust.email || ''
      }));
    }
  };

  // Pre-fill loan from dropdown selection
  const handleSelectLoan = (e) => {
    const appId = e.target.value;
    if (!appId) return;
    const app = (applications || []).find(a => a.applicationId === appId);
    if (app) {
      setForm(prev => ({
        ...prev,
        loanId: app.applicationId,
        customerName: app.applicantName || prev.customerName,
        customerPhone: app.applicantMobile || prev.customerPhone,
        customerEmail: app.applicantEmail || prev.customerEmail,
        amount: app.disbursementDetails?.monthlyEmi || app.amount || prev.amount
      }));
    }
  };

  // Metrics
  const totalGiven = receipts.filter(r => r.type === 'GIVEN').reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const totalTaken = receipts.filter(r => r.type === 'TAKEN').reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const netBalance = totalTaken - totalGiven;

  const filteredReceipts = receipts.filter(r => {
    const matchesType = filterType === 'ALL' || r.type === filterType;
    const q = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      (r.receiptNumber && r.receiptNumber.toLowerCase().includes(q)) ||
      (r.customerName && r.customerName.toLowerCase().includes(q)) ||
      (r.customerPhone && r.customerPhone.includes(q)) ||
      (r.loanId && r.loanId.toLowerCase().includes(q)) ||
      (r.transactionReference && r.transactionReference.toLowerCase().includes(q));

    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Payments & Receipts Ledger</h1>
          <p className="text-xs text-slate-500 mt-1">Maintain customer payment history, money given/taken records, and generate receipts.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            Record Payment / Issue Receipt
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Amount Given */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider block">Total Amount Given (Payouts)</span>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">₹{totalGiven.toLocaleString('en-IN')}</p>
            <span className="text-[10px] text-slate-400 mt-0.5 block">{receipts.filter(r => r.type === 'GIVEN').length} Disbursed Records</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
            <ArrowUpRight size={24} className="stroke-[2.5]" />
          </div>
        </div>

        {/* Amount Taken */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider block">Total Amount Taken (Received)</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">₹{totalTaken.toLocaleString('en-IN')}</p>
            <span className="text-[10px] text-slate-400 mt-0.5 block">{receipts.filter(r => r.type === 'TAKEN').length} Collection Receipts</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <ArrowDownLeft size={24} className="stroke-[2.5]" />
          </div>
        </div>

        {/* Net Flow */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider block">Net Ledger Balance</span>
            <p className={`text-2xl font-extrabold mt-1 ${netBalance >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
              ₹{netBalance.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-slate-400 mt-0.5 block">{netBalance >= 0 ? 'Positive Cashflow' : 'Net Disbursed'}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <Receipt size={24} className="stroke-[2.5]" />
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search receipt #, customer name, loan ID..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${filterType === 'ALL' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              All Records
            </button>
            <button 
              onClick={() => setFilterType('TAKEN')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${filterType === 'TAKEN' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
            >
              Amount Taken (Received)
            </button>
            <button 
              onClick={() => setFilterType('GIVEN')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${filterType === 'GIVEN' ? 'bg-amber-600 text-white shadow-sm' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}
            >
              Amount Given (Payouts)
            </button>
          </div>

        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-3.5 px-6">Receipt #</th>
                <th className="py-3.5 px-4">Transaction Type</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Loan / Ref</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Payment Mode</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReceipts.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-blue-600 font-mono">
                    {item.receiptNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    {item.type === 'TAKEN' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <ArrowDownLeft size={12} /> TAKEN (Received)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                        <ArrowUpRight size={12} /> GIVEN (Disbursed)
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-800">{item.customerName}</p>
                    <p className="text-[11px] text-slate-400">{item.customerPhone || item.customerEmail || '-'}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {item.loanId ? (
                      <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-[11px] text-slate-700">
                        {item.loanId}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-black text-sm text-slate-900">
                    ₹{Number(item.amount).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-600 font-medium">{item.paymentMode}</span>
                    {item.transactionReference && (
                      <p className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">
                        Ref: {item.transactionReference}
                      </p>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-medium whitespace-nowrap">
                    {item.paymentDate}
                  </td>
                  <td className="py-3.5 px-6 text-right space-x-2">
                    <button 
                      onClick={() => setSelectedReceipt(item)}
                      className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1"
                      title="View & Print Official Receipt"
                    >
                      <Receipt size={13} /> Receipt
                    </button>
                    <button 
                      onClick={() => handleDeleteReceipt(item._id, item.receiptNumber)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer inline-flex items-center"
                      title="Delete Entry"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredReceipts.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400 text-xs">
                    No payment records found. Click &quot;Record Payment / Issue Receipt&quot; to log money given or taken.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Record Transaction & Receipt</h3>
                <p className="text-xs text-slate-500">Log money received from or given to a customer</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateReceipt} className="space-y-4 text-xs">
              
              {/* Type Toggle: GIVEN vs TAKEN */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Payment Flow *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: 'TAKEN' })}
                    className={`py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      form.type === 'TAKEN' 
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20' 
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <ArrowDownLeft size={16} /> Amount Taken (Received)
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: 'GIVEN' })}
                    className={`py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      form.type === 'GIVEN' 
                        ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20' 
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <ArrowUpRight size={16} /> Amount Given (Payout)
                  </button>
                </div>
              </div>

              {/* Optional Quick Select from DB Customers */}
              {customersList && customersList.length > 0 && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pick Existing Customer (Optional)</label>
                  <select 
                    onChange={handleSelectCustomer}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="">-- Select from database --</option>
                    {customersList.map(c => (
                      <option key={c._id || c.id} value={c._id || c.id}>
                        {c.name} ({c.phone || c.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Customer Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    placeholder="Enter customer name"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Customer Phone</label>
                  <input
                    type="text"
                    value={form.customerPhone}
                    onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    placeholder="+91 98480 00000"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Amount & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="e.g. 50000"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="text"
                    value={form.paymentDate}
                    onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Mode & Loan ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Mode</label>
                  <select
                    value={form.paymentMode}
                    onChange={(e) => setForm({ ...form, paymentMode: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option>Bank Transfer (NEFT/RTGS)</option>
                    <option>UPI</option>
                    <option>Cash</option>
                    <option>Cheque</option>
                    <option>Demand Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Loan / Application ID</label>
                  <input
                    type="text"
                    value={form.loanId}
                    onChange={(e) => setForm({ ...form, loanId: e.target.value })}
                    placeholder="e.g. APP2026001 (Optional)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Reference number */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Transaction Ref / UTR / Cheque #</label>
                <input
                  type="text"
                  value={form.transactionReference}
                  onChange={(e) => setForm({ ...form, transactionReference: e.target.value })}
                  placeholder="e.g. UTR123456789"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Remarks / Note</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Optional notes regarding this payment"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-colors"
                >
                  Save & Issue Receipt
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Official Receipt Printable Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-slate-200 space-y-6 animate-in zoom-in-95">
            
            {/* Printable Content */}
            <div id="printable-receipt" className="p-6 border-2 border-slate-800 rounded-2xl bg-gradient-to-b from-slate-50/50 to-white relative">
              
              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-black text-[#0e274a] tracking-tight uppercase">SHAYAAN SWARNA MITRA</h2>
                  <p className="text-[10px] text-slate-500 font-semibold">Government Bank Partnered Financial Solutions</p>
                  <p className="text-[10px] text-slate-500">Branch: {selectedReceipt.branch || 'Vijayawada'}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider border ${
                    selectedReceipt.type === 'TAKEN' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-amber-50 text-amber-700 border-amber-300'
                  }`}>
                    {selectedReceipt.type === 'TAKEN' ? 'PAYMENT RECEIPT' : 'DISBURSEMENT VOUCHER'}
                  </span>
                  <p className="text-xs font-mono font-bold text-slate-800 mt-2">#{selectedReceipt.receiptNumber}</p>
                  <p className="text-[10px] text-slate-500">Date: {selectedReceipt.paymentDate}</p>
                </div>
              </div>

              {/* Receipt Body */}
              <div className="py-5 space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500 font-semibold">Customer Name:</span>
                  <span className="font-extrabold text-slate-800">{selectedReceipt.customerName}</span>
                </div>
                {selectedReceipt.customerPhone && (
                  <div className="flex justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500 font-semibold">Contact:</span>
                    <span className="font-semibold text-slate-800">{selectedReceipt.customerPhone}</span>
                  </div>
                )}
                {selectedReceipt.loanId && (
                  <div className="flex justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500 font-semibold">Loan Reference:</span>
                    <span className="font-mono font-bold text-slate-800">#{selectedReceipt.loanId}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500 font-semibold">Payment Mode:</span>
                  <span className="font-semibold text-slate-800">{selectedReceipt.paymentMode}</span>
                </div>
                {selectedReceipt.transactionReference && (
                  <div className="flex justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500 font-semibold">Transaction Ref / UTR:</span>
                    <span className="font-mono text-slate-800">{selectedReceipt.transactionReference}</span>
                  </div>
                )}
                {selectedReceipt.notes && (
                  <div className="flex justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500 font-semibold">Remarks:</span>
                    <span className="text-slate-700 italic">{selectedReceipt.notes}</span>
                  </div>
                )}

                {/* Amount Highlight */}
                <div className="mt-4 p-4 rounded-xl bg-slate-100 flex items-center justify-between border border-slate-300">
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    {selectedReceipt.type === 'TAKEN' ? 'Amount Received:' : 'Amount Disbursed:'}
                  </span>
                  <span className="text-xl font-black text-slate-900">
                    ₹{Number(selectedReceipt.amount).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Signature / Footer */}
              <div className="pt-6 mt-4 border-t border-slate-200 flex justify-between items-end text-[10px] text-slate-500">
                <div>
                  <p className="font-bold text-slate-700">Authorized Signatory</p>
                  <p>{selectedReceipt.receivedOrIssuedBy || 'Branch Officer'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold italic text-slate-400">System Generated e-Receipt</p>
                  <p>100% Secure & Verified</p>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-800 cursor-pointer shadow-md"
                >
                  <Printer size={15} /> Print / Save PDF
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default RepaymentsView;
