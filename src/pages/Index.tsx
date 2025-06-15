
import React, { useState } from 'react';
import Header from '@/components/Header';
import LinkForm from '@/components/LinkForm';
import ScanResults, { ScanResult } from '@/components/ScanResults';
import ScanAnimation from '@/components/ScanAnimation';
import Footer from '@/components/Footer';
import TypingAnimation from '@/components/TypingAnimation';
import { checkLink } from '@/utils/linkChecker';
import { Shield, Mail, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  
  const handleSubmit = async (link: string) => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const scanResult = await checkLink(link);
      setResult(scanResult);
      
      if (!scanResult.isSafe) {
        toast({
          title: scanResult.warningLevel === 'danger' ? 'Security Alert!' : 'Warning',
          description: scanResult.threatDetails || 'This link may be unsafe. Please review the scan results.',
          variant: scanResult.warningLevel === 'danger' ? 'destructive' : 'default',
        });
      }
    } catch (error) {
      console.error('Error scanning link:', error);
      toast({
        title: 'Error',
        description: 'Failed to scan the link. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setResult(null);
  };

  const scrollToCheck = () => {
    const checkElement = document.getElementById('check-section');
    if (checkElement) {
      checkElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const typingWords = [
    "phishing attacks",
    "malicious links", 
    "email scams",
    "suspicious URLs",
    "online threats"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-cyan-100">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
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
                <LinkForm onSubmit={handleSubmit} isLoading={isLoading} />
              ) : isLoading ? (
                <ScanAnimation />
              ) : (
                <ScanResults result={result} onReset={handleReset} />
              )}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
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
        
        {/* Common Threats Section */}
        <section id="about" className="py-16 bg-gray-900/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-cyan-300">Common Online Threats</h2>
            <p className="text-center text-cyan-100/80 max-w-2xl mx-auto mb-12 px-4">
              Stay informed about the most common online threats to protect yourself and your data.
            </p>
            
            <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800/60 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-cyan-800/30">
                <h3 className="text-xl font-medium mb-2 flex items-center gap-2 text-cyan-200">
                  <LinkIcon className="h-5 w-5 text-cyan-400" />
                  Phishing Links
                </h3>
                <p className="text-cyan-100/80 mb-4">
                  Deceptive links that impersonate legitimate websites to steal your personal information or credentials.
                </p>
                <div className="bg-gray-900/50 p-3 rounded-md text-xs text-cyan-200">
                  <strong>Warning Signs:</strong> Misspelled URLs, suspicious domains, requests for personal information.
                </div>
              </div>
              
              <div className="bg-gray-800/60 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-cyan-800/30">
                <h3 className="text-xl font-medium mb-2 flex items-center gap-2 text-cyan-200">
                  <Mail className="h-5 w-5 text-cyan-400" />
                  Malicious Emails
                </h3>
                <p className="text-cyan-100/80 mb-4">
                  Emails containing harmful attachments or links that can install malware or compromise your accounts.
                </p>
                <div className="bg-gray-900/50 p-3 rounded-md text-xs text-cyan-200">
                  <strong>Warning Signs:</strong> Unexpected attachments, urgent requests, poor grammar and spelling.
                </div>
              </div>
              
              <div className="bg-gray-800/60 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-cyan-800/30">
                <h3 className="text-xl font-medium mb-2 flex items-center gap-2 text-cyan-200">
                  <LinkIcon className="h-5 w-5 text-cyan-400" />
                  Malware Distribution
                </h3>
                <p className="text-cyan-100/80 mb-4">
                  Links or downloads that install harmful software to steal information or damage your device.
                </p>
                <div className="bg-gray-900/50 p-3 rounded-md text-xs text-cyan-200">
                  <strong>Warning Signs:</strong> Unexpected download prompts, too-good-to-be-true offers, suspicious file extensions.
                </div>
              </div>
              
              <div className="bg-gray-800/60 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-cyan-800/30">
                <h3 className="text-xl font-medium mb-2 flex items-center gap-2 text-cyan-200">
                  <LinkIcon className="h-5 w-5 text-cyan-400" />
                  Scam Websites
                </h3>
                <p className="text-cyan-100/80 mb-4">
                  Fraudulent websites designed to trick you into making payments or sharing sensitive information.
                </p>
                <div className="bg-gray-900/50 p-3 rounded-md text-xs text-cyan-200">
                  <strong>Warning Signs:</strong> No secure connection (HTTPS), poor design, limited contact information, unrealistic offers.
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Button size="lg" onClick={scrollToCheck} className="bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-500">
                <LinkIcon className="mr-2 h-4 w-4" />
                Check a Link Now
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
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

export default Index;
