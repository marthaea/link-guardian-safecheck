
import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-bold">LinkGuardian</span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
            <a href="#" className="hover:text-primary">Contact Us</a>
          </div>
        </div>
        <div className="mt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} LinkGuardian. All rights reserved. 
          <div className="mt-1">For educational purposes only. Do not rely solely on this tool for security decisions.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
