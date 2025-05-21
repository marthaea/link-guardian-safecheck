
import React from 'react';
import { Shield } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ScanAnimationProps {
  className?: string;
}

const ScanAnimation: React.FC<ScanAnimationProps> = ({ className }) => {
  return (
    <div className={cn("relative flex items-center justify-center py-8", className)}>
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin duration-1000"></div>
        <Shield className="w-10 h-10 text-primary scan-pulse" />
        <div className="scanning-line"></div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">Scanning your link...</p>
        <p className="text-xs text-muted-foreground mt-1">Checking multiple security databases</p>
      </div>
    </div>
  );
};

export default ScanAnimation;
