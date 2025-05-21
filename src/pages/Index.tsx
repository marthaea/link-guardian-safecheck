
import React, { useState } from 'react';
import Header from '@/components/Header';
import LinkForm from '@/components/LinkForm';
import ScanResults, { ScanResult } from '@/components/ScanResults';
import ScanAnimation from '@/components/ScanAnimation';
import Footer from '@/components/Footer';
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="mb-6 flex justify-center">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Link Guardian</span> SafeCheck
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Safely check suspicious links and emails before you click. 
              Protect yourself from phishing, malware, and scams.
            </p>
            
            <div className="flex justify-center mb-8" id="check-section">
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
        <section id="how-it-works" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 border rounded-lg shadow-sm">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <LinkIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Paste Your Link</h3>
                <p className="text-muted-foreground">Paste any suspicious link or email address into our secure checker.</p>
              </div>
              
              <div className="text-center p-6 border rounded-lg shadow-sm">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Instant Analysis</h3>
                <p className="text-muted-foreground">Our system checks against multiple security databases and threat intelligence.</p>
              </div>
              
              <div className="text-center p-6 border rounded-lg shadow-sm">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <ShieldIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Stay Protected</h3>
                <p className="text-muted-foreground">Get clear results and safety recommendations before you click or respond.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Common Threats Section */}
        <section id="about" className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Common Online Threats</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
              Stay informed about the most common online threats to protect yourself and your data.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-medium mb-2 flex items-center gap-2">
                  <LinkIcon className="h-5 w-5 text-primary" />
                  Phishing Links
                </h3>
                <p className="text-muted-foreground mb-4">
                  Deceptive links that impersonate legitimate websites to steal your personal information or credentials.
                </p>
                <div className="bg-slate-50 p-3 rounded-md text-xs">
                  <strong>Warning Signs:</strong> Misspelled URLs, suspicious domains, requests for personal information.
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-medium mb-2 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Malicious Emails
                </h3>
                <p className="text-muted-foreground mb-4">
                  Emails containing harmful attachments or links that can install malware or compromise your accounts.
                </p>
                <div className="bg-slate-50 p-3 rounded-md text-xs">
                  <strong>Warning Signs:</strong> Unexpected attachments, urgent requests, poor grammar and spelling.
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-medium mb-2 flex items-center gap-2">
                  <LinkIcon className="h-5 w-5 text-primary" />
                  Malware Distribution
                </h3>
                <p className="text-muted-foreground mb-4">
                  Links or downloads that install harmful software to steal information or damage your device.
                </p>
                <div className="bg-slate-50 p-3 rounded-md text-xs">
                  <strong>Warning Signs:</strong> Unexpected download prompts, too-good-to-be-true offers, suspicious file extensions.
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-medium mb-2 flex items-center gap-2">
                  <LinkIcon className="h-5 w-5 text-primary" />
                  Scam Websites
                </h3>
                <p className="text-muted-foreground mb-4">
                  Fraudulent websites designed to trick you into making payments or sharing sensitive information.
                </p>
                <div className="bg-slate-50 p-3 rounded-md text-xs">
                  <strong>Warning Signs:</strong> No secure connection (HTTPS), poor design, limited contact information, unrealistic offers.
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Button size="lg" onClick={scrollToCheck}>
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
