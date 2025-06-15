
import React from 'react';
import { Shield } from 'lucide-react';
import TypingAnimation from '@/components/TypingAnimation';
import LinkForm from '@/components/LinkForm';
import ScanAnimation from '@/components/ScanAnimation';
import ScanResults, { ScanResult } from '@/components/ScanResults';

interface HeroSectionProps {
  isLoading: boolean;
  result: ScanResult | null;
  onSubmit: (link: string) => void;
  onReset: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  isLoading,
  result,
  onSubmit,
  onReset,
}) => {
  const typingWords = [
    "phishing attacks",
    "malicious links", 
    "email scams",
    "suspicious URLs",
    "online threats"
  ];

  return (
    <section 
      className="relative bg-cover bg-center bg-no-repeat py-16 md:py-20 min-h-[80vh] flex items-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 20, 40, 0.7), rgba(0, 40, 60, 0.8)), url('/lovable-uploads/9530a286-4188-4669-ac6a-1df0f5fc0963.png')`
      }}
    >
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="mb-6 flex justify-center">
          <Shield className="h-12 w-12 md:h-16 md:w-16 text-cyan-400" />
        </div>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Link Guardian</span> SafeCheck
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-cyan-100 max-w-3xl mx-auto mb-2 px-4">
          Safely check suspicious links and emails before you click.
        </p>
        <p className="text-lg md:text-xl lg:text-2xl text-cyan-100 max-w-3xl mx-auto mb-8 px-4">
          Protect yourself from <TypingAnimation words={typingWords} />.
        </p>
        
        <div className="flex justify-center mb-8 px-4" id="check-section">
          {!isLoading && !result ? (
            <LinkForm onSubmit={onSubmit} isLoading={isLoading} />
          ) : isLoading ? (
            <ScanAnimation />
          ) : (
            <ScanResults result={result} onReset={onReset} />
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
