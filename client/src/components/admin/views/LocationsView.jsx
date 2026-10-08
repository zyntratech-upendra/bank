import React from 'react';
import { 
  ChevronRight, Search, Download, Eye, Plus, CheckCircle2, 
  MapPin, Save, Users, ShieldCheck, FileText, Clock, Wallet, 
  Coins, TrendingUp, Filter, AlertCircle, BarChart3, Building,
  Check, Settings as SettingsIcon, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LocationsView = (props) => {
  const {
    adminUser, stats, selectedBranch, setSelectedBranch,
    applications, filteredApplications, getStatusBadge,
    setActiveTab, setSelectedApplication, showToast,
    customersList, customersPage, setCustomersPage, customersPerPage,
    setSelectedCustomer, setShowCustomerModal,
    disbursementForm, setDisbursementForm, handleDisburseLoanSubmit,
    usersList, setEditingUser, setShowAddUserModal,
    activeSettingsTab, setActiveSettingsTab, currentSettingForm, setCurrentSettingForm, handleSaveSettings,
    locationsList, setEditingLocation, setShowLocationModal, handleRemoveLocation
  } = props;

  return (
<div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Service Locations</h1>
                  <p className="text-xs text-slate-500">Manage city names, branch addresses, and services provided.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingLocation(null);
                    setShowLocationModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer flex items-center gap-2"
                >
                  <Plus size={16} />
                  <span>Add Location</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {locationsList.map((loc) => (
                  <div key={loc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                          <MapPin size={18} className="text-blue-600" />
                          {loc.city}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">{loc.address}</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-100 text-xs">
                      <p className="font-semibold text-slate-700 mb-1">Contact: <span className="font-normal text-slate-600">{loc.contact}</span></p>
                      <p className="font-semibold text-slate-700 mb-1">Services:</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {loc.services.map((srv, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-medium text-[10px]">
                            {srv}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2 flex gap-2">
                      <button 
                        onClick={() => {
                          setEditingLocation(loc);
                          setShowLocationModal(true);
                        }}
                        className="flex-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-colors" 
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleRemoveLocation(loc.id)}
                        className="flex-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-lg cursor-pointer transition-colors" 
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
);
};

export default LocationsView;
