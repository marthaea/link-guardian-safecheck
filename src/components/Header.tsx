
import React from 'react';
import { Shield } from 'lucide-react';
import InstallButton from './InstallButton';

const Header = () => {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-cyan-400" />
            <h1 className="ml-2 text-xl font-bold text-white">Link Guardian</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <InstallButton />
            <nav className="hidden md:flex space-x-8">
              <a href="#how-it-works" className="text-gray-300 hover:text-cyan-400 transition-colors">
                How It Works
              </a>
              <a href="#threats" className="text-gray-300 hover:text-cyan-400 transition-colors">
                Common Threats
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
