import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ShieldCheck, Loader2 } from 'lucide-react';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1e38] flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4 border border-white/10 backdrop-blur-md">
          <Loader2 className="animate-spin text-[#c48722]" size={32} />
        </div>
        <p className="text-sm font-semibold tracking-wider text-slate-300 uppercase">
          Verifying Security Credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtectedRoute;
