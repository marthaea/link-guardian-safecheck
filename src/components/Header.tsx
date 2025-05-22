
import { Button } from "@/components/ui/button";
import { Link, Shield } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import BulkCheck from "./BulkCheck";

const Header = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">LinkGuardian</span>
        </div>
        <div className="flex items-center gap-4">
          <nav>
            <ul className="flex gap-6">
              <li>
                <a href="#" className="text-sm font-medium hover:text-primary">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-sm font-medium hover:text-primary">
                  About
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-sm font-medium hover:text-primary">
                  How It Works
                </a>
              </li>
            </ul>
          </nav>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button size="sm" variant="outline">
                <Link className="mr-2 h-4 w-4" />
                Bulk Check
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Bulk URL Checker</SheetTitle>
                <SheetDescription>
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
