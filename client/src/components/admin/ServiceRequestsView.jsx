import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle2, XCircle, FileText, ChevronDown, Download, Users, Briefcase, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const ServiceRequestsView = ({ showToast, routeId }) => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visitDate, setVisitDate] = useState('');
  const [disbursementData, setDisbursementData] = useState({ amount: '', interestRate: '', returnDate: '' });

  const selectedReq = requests.find(r => r._id === routeId) || null;

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchRequests = async () => {
    try {
      const res = await api.get('/admin/service-requests');
      setRequests(res.data);
    } catch (err) {
      showToast('Error loading service requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id, status, extraData = null) => {
    try {
      let remarks = 'Updated by Admin';
      if (status === 'Under Review' && visitDate) {
        remarks = `Office Visit Scheduled for ${new Date(visitDate).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}`;
      }
      if (status === 'Completed' && extraData) {
        remarks = `Issued ₹${extraData['Issued Amount']} at ${extraData['Interest Rate']}.`;
      }
      if (status === 'Cleared' && extraData) {
        remarks = `Loan Cleared. Returned ₹${extraData['Returned Amount']}.`;
      }
      
      const res = await api.patch(`/admin/service-requests/${id}/status`, { status, remarks, extraData });
      setRequests(prev => prev.map(r => r._id === id ? res.data : r));
      showToast(`Request marked as ${status}`);
      setVisitDate('');
      setDisbursementData({ amount: '', interestRate: '', returnDate: '' });
      if (status === 'Completed' || status === 'Rejected' || status === 'Cleared') {
         navigate('/admin/service-requests');
      }
    } catch (err) {
      showToast('Error updating status');
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const paginatedRequests = requests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (selectedReq) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between gap-4">
          <button 
            onClick={() => { navigate('/admin/service-requests'); setVisitDate(''); setDisbursementData({ amount: '', interestRate: '', returnDate: '' }); }} 
            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Requests
          </button>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200 w-full p-7">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <FileText size={18} />
              </div>
              Request Details
            </h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Customer Name</p>
                <p className="font-bold text-slate-800">{selectedReq.customerName}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contact</p>
                <p className="font-bold text-slate-800">{selectedReq.phone}</p>
                <p className="text-xs text-slate-500">{selectedReq.email}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Service Requested</p>
                <p className="font-bold text-blue-700">{selectedReq.serviceName}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                  selectedReq.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                  selectedReq.status === 'Completed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                  selectedReq.status === 'Cleared' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                  selectedReq.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                  'bg-amber-50 text-amber-700 border-amber-100'
                }`}>
                  {selectedReq.status}
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10" />
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500"/> Submitted Form Data</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                {selectedReq.formData && Object.entries(selectedReq.formData).map(([key, val]) => (
                  <div key={key} className={typeof val === 'string' && val.startsWith('data:image') ? "sm:col-span-2" : ""}>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <div className="text-sm font-semibold text-slate-800 break-words">
                      {typeof val === 'string' && val.startsWith('data:image') ? (
                        <a href={val} target="_blank" rel="noreferrer" className="block mt-2 group relative rounded-xl overflow-hidden border-2 border-slate-100 hover:border-blue-300 transition-colors w-fit">
                          <img src={val} alt="Uploaded" className="w-full max-w-sm h-auto object-cover" />
                          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center">
                            <span className="bg-white/90 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">Click to view full image</span>
                          </div>
                        </a>
                      ) : (
                        <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">{val || 'N/A'}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedReq.adminRemarks && selectedReq.adminRemarks !== 'Updated by Admin' && (
              <div className="mb-6 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <h3 className="text-sm font-bold text-amber-900 mb-1 flex items-center gap-2">
                  Admin Notes
                </h3>
                <p className="text-sm font-semibold text-amber-800">{selectedReq.adminRemarks}</p>
              </div>
            )}

            {/* Staged Workflow Actions */}
            <div className="flex flex-col gap-3 border-t border-slate-100 pt-5">
              <div className="flex flex-col gap-3 justify-end items-end w-full">
                {selectedReq.status === 'Pending' && (
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full justify-end">
                    <div className="w-full sm:w-auto">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Schedule Visit (Optional)</label>
                      <input 
                        type="datetime-local" 
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        className="w-full sm:w-auto text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-blue-500 focus:bg-white transition-colors"
                      />
                    </div>
                    <button 
                      onClick={() => handleUpdateStatus(selectedReq._id, 'Under Review')} 
                      className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-700 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-105 cursor-pointer h-[42px]"
                    >
                      <CheckCircle2 size={16} /> Contact Customer & Mark Under Review
                    </button>
                  </div>
                )}
                
                {selectedReq.status === 'Under Review' && (
                  <button 
                    onClick={() => handleUpdateStatus(selectedReq._id, 'Verified')} 
                    className="px-6 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 font-bold rounded-xl flex items-center gap-2 shadow-lg transition-all hover:scale-105 cursor-pointer"
                  >
                    <CheckCircle2 size={16} /> Office Visit & Documents Verified
                  </button>
                )}

                {selectedReq.status === 'Verified' && (
                  <div className="w-full">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Issued Amount (₹)</label>
                        <input 
                          type="number" 
                          value={disbursementData.amount}
                          onChange={(e) => setDisbursementData(prev => ({ ...prev, amount: e.target.value }))}
                          className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-blue-500"
                          placeholder="e.g. 150000"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Interest Rate (%)</label>
                        <input 
                          type="text" 
                          value={disbursementData.interestRate}
                          onChange={(e) => setDisbursementData(prev => ({ ...prev, interestRate: e.target.value }))}
                          className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-blue-500"
                          placeholder="e.g. 8.5% p.a"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Return Date</label>
                        <input 
                          type="date" 
                          value={disbursementData.returnDate}
                          onChange={(e) => setDisbursementData(prev => ({ ...prev, returnDate: e.target.value }))}
                          className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button 
                        onClick={() => handleUpdateStatus(selectedReq._id, 'Completed', { 
                          'Issued Amount': disbursementData.amount,
                          'Interest Rate': disbursementData.interestRate,
                          'Expected Return Date': disbursementData.returnDate
                        })} 
                        disabled={!disbursementData.amount || !disbursementData.interestRate}
                        className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 cursor-pointer"
                      >
                        <CheckCircle2 size={16} /> Amount Issued & Completed
                      </button>
                    </div>
                  </div>
                )}
                
                {selectedReq.status === 'Completed' && (
                  <div className="w-full">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Returned Amount (₹) (incl. interest)</label>
                        <input 
                          type="number" 
                          value={disbursementData.returnedAmount || ''}
                          onChange={(e) => setDisbursementData(prev => ({ ...prev, returnedAmount: e.target.value }))}
                          className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-blue-500"
                          placeholder="e.g. 175000"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button 
                        onClick={() => handleUpdateStatus(selectedReq._id, 'Cleared', { 
                          'Returned Amount': disbursementData.returnedAmount
                        })} 
                        disabled={!disbursementData.returnedAmount}
                        className="w-full sm:w-auto px-6 py-2.5 bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 transition-all hover:scale-105 cursor-pointer"
                      >
                        <CheckCircle2 size={16} /> Mark as Cleared
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {(selectedReq.status !== 'Rejected' && selectedReq.status !== 'Completed' && selectedReq.status !== 'Cleared') && (
                <div className="flex justify-end">
                  <button 
                    onClick={() => handleUpdateStatus(selectedReq._id, 'Rejected')} 
                    className="text-xs text-rose-500 hover:text-rose-700 font-bold underline cursor-pointer"
                  >
                    Reject Request
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 drop-shadow-sm">Service Requests</h1>
          <p className="text-xs text-slate-500 mt-1">Manage and verify customer requests for various services.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => showToast('Exporting requests...')}
            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
          >
            <Download size={16} />
            Export Data
          </button>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-2xl shadow-slate-200/50 overflow-hidden relative">
        {/* Decorative glassmorphism glow */}
        <div className="absolute top-0 left-0 -ml-16 -mt-16 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/40 border-b border-slate-200/60 text-slate-500 uppercase text-[10px] tracking-widest font-bold">
                <th className="py-4 px-6">Customer Details</th>
                <th className="py-4 px-4">Service</th>
                <th className="py-4 px-4 hidden sm:table-cell">Date</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/60">
              {paginatedRequests.map((req, i) => (
                <tr key={req._id || i} className="hover:bg-white/60 transition-all duration-300 group">
                  <td className="py-4 px-6 font-bold text-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 overflow-hidden">
                      <span className="font-bold text-sm">{req.customerName?.charAt(0) || 'C'}</span>
                    </div>
                    <div>
                      <span className="block font-bold text-sm">{req.customerName}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{req.phone}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-blue-700">{req.serviceName}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{req.email}</div>
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-medium hidden sm:table-cell">
                    {new Date(req.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                      req.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      req.status === 'Completed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      req.status === 'Cleared' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                      req.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                      'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => navigate(`/admin/service-requests/${req._id}`)}
                        className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-bold transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center animate-in zoom-in duration-500">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300 shadow-inner">
                        <Briefcase size={32} />
                      </div>
                      <h3 className="text-slate-700 font-bold mb-1">No Requests Found</h3>
                      <p className="text-slate-400 text-xs">There are no service requests submitted yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Glassmorphic Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-slate-200/60 p-4 flex items-center justify-between bg-white/40 relative z-10">
            <p className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-800">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-slate-800">{Math.min(currentPage * itemsPerPage, requests.length)}</span> of <span className="font-bold text-slate-800">{requests.length}</span> entries
            </p>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentPage === i + 1 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceRequestsView;
