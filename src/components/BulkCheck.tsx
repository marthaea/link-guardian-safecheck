
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { checkLink } from '@/utils/linkChecker';
import { toast } from "@/hooks/use-toast";
import { ScanResult } from './ScanResults';
import { Check, AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';

interface BulkCheckProps {
  onClose: () => void;
}

const BulkCheck: React.FC<BulkCheckProps> = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) {
      toast({
        title: "Empty Input",
        description: "Please enter at least one URL to check.",
        variant: "destructive",
      });
      return;
    }
    
    setIsChecking(true);
    setResults([]);
    
    // Split input by newlines, commas, or spaces
    const links = input
      .split(/[\n,\s]+/)
      .map(link => link.trim())
      .filter(link => link.length > 0);
    
    try {
      // Process links in sequence to avoid too many concurrent requests
      for (const link of links) {
        try {
          const result = await checkLink(link);
          setResults(prev => [...prev, result]);
        } catch (error) {
          console.error(`Error checking link ${link}:`, error);
          // Continue with other links even if one fails
        }
      }
      
      toast({
        title: "Scan Complete",
        description: `Checked ${links.length} URLs for security threats.`,
      });
      
    } catch (error) {
      console.error('Bulk check error:', error);
      toast({
        title: "Error",
        description: "Failed to complete the bulk scan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };
  
  const getStatusIcon = (result: ScanResult) => {
    if (result.warningLevel === 'safe') {
      return <ShieldCheck className="h-4 w-4 text-[hsl(var(--safe))]" />;
    } else if (result.warningLevel === 'warning') {
      return <AlertTriangle className="h-4 w-4 text-[hsl(var(--warning))]" />;
    } else {
      return <ShieldAlert className="h-4 w-4 text-[hsl(var(--danger))]" />;
    }
  };

  return (
    <div className="pt-6 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="bulk-urls" className="text-sm font-medium mb-2 block">
            Enter multiple URLs (one per line or separated by commas)
          </label>
          <Textarea
            id="bulk-urls"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://example.com&#10;https://another-site.com&#10;suspicious-site.net"
            rows={6}
            disabled={isChecking}
            className="w-full resize-none"
          />
        </div>
        
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onClose} disabled={isChecking}>
            Cancel
          </Button>
          <Button type="submit" disabled={isChecking}>
            {isChecking ? 'Checking...' : 'Check All URLs'}
          </Button>
        </div>
      </form>
      
      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Results</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {results.map((result, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-md border flex items-start justify-between gap-2 ${
                  result.isSafe ? 'bg-green-50 border-green-200' : 
                  result.warningLevel === 'warning' ? 'bg-yellow-50 border-yellow-200' : 
                  'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {getStatusIcon(result)}
                  <span className="text-sm truncate font-medium">{result.url}</span>
                </div>
                <div className="text-xs whitespace-nowrap">
                  {result.isSafe ? 'Safe' : 'Potentially unsafe'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkCheck;
