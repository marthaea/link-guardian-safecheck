
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
    // If not on homepage, navigate to homepage first then scroll
    if (window.location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Floating Navbar Container */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 pt-6">
        <div className="max-w-6xl mx-auto">
          <header className={`transition-all duration-500 ease-out rounded-2xl ${
            isScrolled 
              ? 'py-3 px-8 bg-gray-900/95 backdrop-blur-xl shadow-2xl border border-gray-700/50' 
              : 'py-5 px-10 bg-transparent'
          }`}>
            <div className="flex justify-between items-center">
              {/* Logo */}
              <div className="flex items-center space-x-3 flex-shrink-0">
                <Shield className={`transition-all duration-300 ${
                  isScrolled ? 'h-6 w-6' : 'h-7 w-7'
                } text-cyan-400`} />
                <h1 className={`transition-all duration-300 font-bold text-white ${
                  isScrolled ? 'text-lg' : 'text-xl'
                }`}>
                  Link Guardian
                </h1>
              </div>
              
              {/* Desktop Navigation - Centered */}
              <div className="hidden lg:flex items-center justify-center flex-1 mx-16">
                <nav className="flex items-center space-x-12">
                  <button 
                    onClick={() => scrollToSection('how-it-works')}
                    className="text-gray-200 hover:text-cyan-400 transition-all duration-300 font-medium text-sm tracking-wider uppercase relative group"
                  >
                    How It Works
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></div>
                  </button>
                  <button 
                    onClick={() => scrollToSection('threats')}
                    className="text-gray-200 hover:text-cyan-400 transition-all duration-300 font-medium text-sm tracking-wider uppercase relative group"
                  >
                    Common Threats
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></div>
                  </button>
                  <Link 
                    to="/awareness"
                    className="text-gray-200 hover:text-cyan-400 transition-all duration-300 font-medium text-sm tracking-wider uppercase relative group"
                  >
                    Awareness
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></div>
                  </Link>
                  <Link 
                    to="/heuristics"
                    className="text-gray-200 hover:text-cyan-400 transition-all duration-300 font-medium text-sm tracking-wider uppercase relative group"
                  >
                    Heuristics
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></div>
                  </Link>
                </nav>
              </div>

              {/* Action Buttons */}
              <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
                <InstallButton />
                <Button
                  onClick={handleBulkCheckOpen}
                  variant="outline"
                  size="sm"
                  className="text-cyan-400 border-cyan-400/40 hover:bg-cyan-400 hover:text-gray-900 bg-transparent backdrop-blur-sm transition-all duration-300 px-6 py-2 rounded-full font-medium"
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
                  className="text-gray-200 hover:text-cyan-400 hover:bg-white/10 rounded-full"
                >
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </Button>
              </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
              <div className="lg:hidden mt-6 py-6 bg-gray-900/95 backdrop-blur-md rounded-xl border border-gray-700/50 -mx-4">
                <nav className="flex flex-col space-y-6 px-8">
                  <button 
                    onClick={() => scrollToSection('how-it-works')}
                    className="text-left text-gray-200 hover:text-cyan-400 transition-colors py-2 font-medium text-sm tracking-wider uppercase"
                  >
                    How It Works
                  </button>
                  <button 
                    onClick={() => scrollToSection('threats')}
                    className="text-left text-gray-200 hover:text-cyan-400 transition-colors py-2 font-medium text-sm tracking-wider uppercase"
                  >
                    Common Threats
                  </button>
                  <Link 
                    to="/awareness"
                    className="text-left text-gray-200 hover:text-cyan-400 transition-colors py-2 font-medium text-sm tracking-wider uppercase"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Awareness
                  </Link>
                  <Link 
                    to="/heuristics"
                    className="text-left text-gray-200 hover:text-cyan-400 transition-colors py-2 font-medium text-sm tracking-wider uppercase"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Heuristics
                  </Link>
                  <div className="flex flex-col space-y-4 pt-6 border-t border-gray-700/50">
                    <InstallButton />
                    <Button
                      onClick={handleBulkCheckOpen}
                      variant="outline"
                      size="sm"
                      className="text-cyan-400 border-cyan-400/50 hover:bg-cyan-400 hover:text-gray-900 bg-transparent justify-start rounded-full font-medium"
                    >
                      Bulk Check
                    </Button>
                  </div>
                </nav>
              </div>
            )}
          </header>
        </div>
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
    </>
  );
};

export default Header;
