
import React from 'react';
import { Shield, Link as LinkIcon } from 'lucide-react';

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 bg-gray-800/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-cyan-300">How It Works</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="text-center p-6 border border-cyan-800/30 rounded-lg shadow-lg bg-gray-900/70 backdrop-blur-sm">
            <div className="bg-cyan-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <LinkIcon className="h-8 w-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-medium mb-2 text-cyan-200">Paste Your Link</h3>
            <p className="text-cyan-100/80">Paste any suspicious link or email address into our secure checker.</p>
          </div>
          
          <div className="text-center p-6 border border-cyan-800/30 rounded-lg shadow-lg bg-gray-900/70 backdrop-blur-sm">
            <div className="bg-cyan-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-medium mb-2 text-cyan-200">Instant Analysis</h3>
            <p className="text-cyan-100/80">Our system checks against multiple security databases and threat intelligence.</p>
          </div>
          
          <div className="text-center p-6 border border-cyan-800/30 rounded-lg shadow-lg bg-gray-900/70 backdrop-blur-sm">
            <div className="bg-cyan-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <ShieldIcon className="h-8 w-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-medium mb-2 text-cyan-200">Stay Protected</h3>
            <p className="text-cyan-100/80">Get clear results and safety recommendations before you click or respond.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ShieldIcon component for the third "How It Works" item
const ShieldIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 22-9-4.9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12.1L12 22z" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);

export default HowItWorksSection;
