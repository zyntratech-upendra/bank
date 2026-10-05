import { Link } from 'react-router-dom';
import { Landmark, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brand-blue-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="bg-white p-2 rounded-lg text-brand-blue-900">
                <Landmark size={28} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white leading-tight">BANKING</h1>
                <p className="text-[10px] text-brand-gold-400 font-semibold tracking-widest uppercase">Services</p>
              </div>
            </Link>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Your trusted financial partner for gold loans, loan transfers, and one-lending solutions with nearby Government Banks.
            </p>
            <div className="flex space-x-4">
              {/* Facebook */}
              <a href="#" className="w-8 h-8 rounded-full bg-brand-blue-800 flex items-center justify-center hover:bg-brand-gold-400 hover:text-brand-blue-900 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              {/* Twitter / X */}
              <a href="#" className="w-8 h-8 rounded-full bg-brand-blue-800 flex items-center justify-center hover:bg-brand-gold-400 hover:text-brand-blue-900 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              {/* Instagram */}
              <a href="#" className="w-8 h-8 rounded-full bg-brand-blue-800 flex items-center justify-center hover:bg-brand-gold-400 hover:text-brand-blue-900 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              {/* LinkedIn */}
              <a href="#" className="w-8 h-8 rounded-full bg-brand-blue-800 flex items-center justify-center hover:bg-brand-gold-400 hover:text-brand-blue-900 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-brand-gold-400 transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-brand-gold-400 transition-colors">Our Services</Link></li>
              <li><Link to="/contact" className="hover:text-brand-gold-400 transition-colors">Contact Us</Link></li>
              <li><a href="#" className="hover:text-brand-gold-400 transition-colors">EMI Calculator</a></li>
              <li><a href="#" className="hover:text-brand-gold-400 transition-colors">Check Eligibility</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Services</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-brand-gold-400 transition-colors">Gold Loan</a></li>
              <li><a href="#" className="hover:text-brand-gold-400 transition-colors">Loan Transfer</a></li>
              <li><a href="#" className="hover:text-brand-gold-400 transition-colors">One Lending Solution</a></li>
              <li><a href="#" className="hover:text-brand-gold-400 transition-colors">Personal Loan</a></li>
              <li><a href="#" className="hover:text-brand-gold-400 transition-colors">Business Loan</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Contact Info</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-brand-gold-400 shrink-0 mt-0.5" />
                <span>MG Road, Vijayawada, Andhra Pradesh - 520010</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-brand-gold-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-brand-gold-400 shrink-0" />
                <span>support@bankingservices.in</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-brand-blue-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} Banking Services. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
