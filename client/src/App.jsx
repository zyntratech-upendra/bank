import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import UserDashboard from './pages/UserDashboard';

// Admin Imports
import { AdminAuthProvider } from './context/AdminAuthContext';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

// Public Layout wrapper with standard header/footer
const PublicLayout = () => (
  <div className="flex flex-col min-h-screen bg-[#fcfdfd] font-sans text-slate-800 antialiased selection:bg-[#c48722]/20">
    <Navbar />
    <main className="flex-grow pt-20">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <AdminAuthProvider>
      <AnimatePresence>
        {loading && <Loader onFinish={() => setLoading(false)} />}
      </AnimatePresence>

      <Router>
        <Routes>
          {/* Dedicated Admin Portal Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/:tab?" 
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } 
          />

          {/* Customer Facing Web Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<UserDashboard />} />
          </Route>
          {/* Standalone Legal Pages */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AdminAuthProvider>
  );
}

export default App;
