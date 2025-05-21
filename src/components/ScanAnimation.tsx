
import React, { useEffect, useState } from 'react';
import { Shield, CheckCircle, Database, Globe } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ScanAnimationProps {
  className?: string;
}

const ScanAnimation: React.FC<ScanAnimationProps> = ({ className }) => {
  const [scanStage, setScanStage] = useState(0);
  const stages = [
    "Initializing scan...",
    "Checking domain reputation...",
    "Searching security databases...",
    "Analyzing link structure...",
    "Finalizing results..."
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setScanStage(prev => {
        // Reset to first stage if we've gone through all stages
        if (prev >= stages.length - 1) return 0;
        return prev + 1;
      });
    }, 400); // Update every 400ms
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("relative flex flex-col items-center justify-center py-8", className)}>
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin duration-1000"></div>
        <Shield className="w-10 h-10 text-primary scan-pulse" />
        <div className="scanning-line"></div>
      </div>
      
      <div className="mt-6 text-center space-y-3">
        <p className="text-sm font-medium">{stages[scanStage]}</p>
        
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <div className={cn("flex items-center", scanStage >= 1 ? "text-primary" : "text-muted-foreground")}>
            <Globe className="w-3 h-3 mr-1" /> 
            <span>Domain</span>
          </div>
          <span>→</span>
          <div className={cn("flex items-center", scanStage >= 2 ? "text-primary" : "text-muted-foreground")}>
            <Database className="w-3 h-3 mr-1" /> 
            <span>Database</span>
          </div>
          <span>→</span>
          <div className={cn("flex items-center", scanStage >= 3 ? "text-primary" : "text-muted-foreground")}>
            <Shield className="w-3 h-3 mr-1" /> 
            <span>Security</span>
          </div>
          <span>→</span>
          <div className={cn("flex items-center", scanStage >= 4 ? "text-primary" : "text-muted-foreground")}>
            <CheckCircle className="w-3 h-3 mr-1" /> 
            <span>Results</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanAnimation;
