
import { Button } from "@/components/ui/button";
import { Link as LinkIcon, Shield } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import BulkCheck from "./BulkCheck";

const Header = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="border-b border-cyan-800/30 bg-gray-900/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-cyan-400" />
          <span className="font-bold text-xl text-cyan-100">LinkGuardian</span>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <nav className="hidden md:block">
            <ul className="flex gap-4 lg:gap-6">
              <li>
                <Link to="/" className="text-sm font-medium hover:text-cyan-400 text-cyan-100 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a href="#about" className="text-sm font-medium hover:text-cyan-400 text-cyan-100 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-sm font-medium hover:text-cyan-400 text-cyan-100 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <Link to="/contact" className="text-sm font-medium hover:text-cyan-400 text-cyan-100 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button size="sm" variant="outline" className="border-cyan-600 text-cyan-100 bg-gray-800/50 hover:bg-cyan-600/20 hover:text-cyan-300">
                <LinkIcon className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Bulk Check</span>
                <span className="sm:hidden">Bulk</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-gray-900 border-cyan-800/30 text-cyan-100">
              <SheetHeader>
                <SheetTitle className="text-cyan-300">Bulk URL Checker</SheetTitle>
                <SheetDescription className="text-cyan-100/80">
                  Check multiple URLs at once for security threats
                </SheetDescription>
              </SheetHeader>
              <BulkCheck onClose={() => setIsSheetOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
