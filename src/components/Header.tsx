
import React, { useState } from 'react';
import { Shield, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import BulkCheck from './BulkCheck';

const Header = () => {
  const [showBulkCheck, setShowBulkCheck] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleBulkCheckOpen = () => {
    setShowBulkCheck(true);
    setIsMobileMenuOpen(false);
  };

  const handleBulkCheckClose = () => {
    setShowBulkCheck(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-cyan-400" />
            <h1 className="ml-2 text-xl font-bold text-white">Link Guardian</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <nav className="flex space-x-6">
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-300 hover:text-cyan-400 transition-colors"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('threats')}
                className="text-gray-300 hover:text-cyan-400 transition-colors"
              >
                Common Threats
              </button>
              <Link 
                to="/heuristics"
                className="text-gray-300 hover:text-cyan-400 transition-colors"
              >
                Heuristics
              </Link>
            </nav>
            <Button
              onClick={handleBulkCheckOpen}
              variant="outline"
              size="sm"
              className="text-cyan-400 border-cyan-400 hover:bg-cyan-400 hover:text-gray-900"
            >
              Bulk Check
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              onClick={toggleMobileMenu}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-cyan-400"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-700 py-4">
            <nav className="flex flex-col space-y-3">
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-left text-gray-300 hover:text-cyan-400 transition-colors py-2"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('threats')}
                className="text-left text-gray-300 hover:text-cyan-400 transition-colors py-2"
              >
                Common Threats
              </button>
              <Link 
                to="/heuristics"
                className="text-left text-gray-300 hover:text-cyan-400 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Heuristics
              </Link>
              <Button
                onClick={handleBulkCheckOpen}
                variant="outline"
                size="sm"
                className="text-cyan-400 border-cyan-400 hover:bg-cyan-400 hover:text-gray-900 w-full justify-start"
              >
                Bulk Check
              </Button>
            </nav>
          </div>
        )}
      </div>

      {/* Bulk Check Modal/Overlay */}
      {showBulkCheck && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-cyan-300">Bulk Link Check</h2>
                <Button
                  onClick={handleBulkCheckClose}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </Button>
              </div>
              <BulkCheck onClose={handleBulkCheckClose} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
