
import React, { useState, useEffect } from 'react';
import { Shield, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import BulkCheck from './BulkCheck';
import InstallButton from './InstallButton';

const Header = () => {
  const [showBulkCheck, setShowBulkCheck] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
      isScrolled 
        ? 'py-3 bg-gray-900/95 backdrop-blur-md shadow-lg' 
        : 'py-6 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Shield className={`transition-all duration-300 ${
              isScrolled ? 'h-7 w-7' : 'h-8 w-8'
            } text-cyan-400`} />
            <h1 className={`transition-all duration-300 font-bold text-white ${
              isScrolled ? 'text-lg' : 'text-xl'
            }`}>
              Link Guardian
            </h1>
          </div>
          
          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-12">
            <nav className="flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-200 hover:text-cyan-400 transition-all duration-300 font-medium text-sm tracking-wide uppercase"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('threats')}
                className="text-gray-200 hover:text-cyan-400 transition-all duration-300 font-medium text-sm tracking-wide uppercase"
              >
                Common Threats
              </button>
              <Link 
                to="/heuristics"
                className="text-gray-200 hover:text-cyan-400 transition-all duration-300 font-medium text-sm tracking-wide uppercase"
              >
                Heuristics
              </Link>
            </nav>
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <InstallButton />
            <Button
              onClick={handleBulkCheckOpen}
              variant="outline"
              size="sm"
              className="text-cyan-400 border-cyan-400/50 hover:bg-cyan-400 hover:text-gray-900 bg-transparent backdrop-blur-sm transition-all duration-300"
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
              className="text-gray-200 hover:text-cyan-400 hover:bg-white/10"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 py-4 bg-gray-900/95 backdrop-blur-md rounded-lg border border-gray-700/50">
            <nav className="flex flex-col space-y-4 px-4">
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-left text-gray-200 hover:text-cyan-400 transition-colors py-2 font-medium text-sm tracking-wide uppercase"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('threats')}
                className="text-left text-gray-200 hover:text-cyan-400 transition-colors py-2 font-medium text-sm tracking-wide uppercase"
              >
                Common Threats
              </button>
              <Link 
                to="/heuristics"
                className="text-left text-gray-200 hover:text-cyan-400 transition-colors py-2 font-medium text-sm tracking-wide uppercase"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Heuristics
              </Link>
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-700/50">
                <InstallButton />
                <Button
                  onClick={handleBulkCheckOpen}
                  variant="outline"
                  size="sm"
                  className="text-cyan-400 border-cyan-400/50 hover:bg-cyan-400 hover:text-gray-900 bg-transparent justify-start"
                >
                  Bulk Check
                </Button>
              </div>
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
