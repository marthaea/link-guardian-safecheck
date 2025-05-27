
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-cyan-800/30 py-8 mt-16 bg-gray-900/90 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Shield className="h-5 w-5 text-cyan-400" />
            <span className="font-bold text-cyan-100">LinkGuardian</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-8 items-center text-sm text-cyan-100/80">
            <Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-cyan-400 transition-colors">Contact Us</Link>
          </div>
        </div>
        <div className="mt-6 text-center text-xs text-cyan-100/60">
          &copy; {new Date().getFullYear()} LinkGuardian by Nexus. All rights reserved. 
          <div className="mt-1">For educational purposes only. Do not rely solely on this tool for security decisions.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
