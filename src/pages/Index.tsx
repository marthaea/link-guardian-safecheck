
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import CommonThreatsSection from '@/components/CommonThreatsSection';
import ReviewsSection from '@/components/ReviewsSection';
import { ScanResult } from '@/components/ScanResults';
import { checkLink } from '@/utils/linkChecker';
import { toast } from '@/hooks/use-toast';

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
    <div className="min-h-screen flex flex-col bg-gray-900 text-cyan-100">
      <Header />
      
      <main className="flex-1 pt-20">
        <HeroSection 
          isLoading={isLoading}
          result={result}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />
        
        <HowItWorksSection />
        
        <CommonThreatsSection onScrollToCheck={scrollToCheck} />
        
        <ReviewsSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
