
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
      return <ShieldCheck className="h-4 w-4 text-green-400" />;
    } else if (result.warningLevel === 'warning') {
      return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
    } else {
      return <ShieldAlert className="h-4 w-4 text-red-400" />;
    }
  };

  return (
    <div className="pt-6 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="bulk-urls" className="text-sm font-medium mb-2 block text-cyan-200">
            Enter multiple URLs (one per line or separated by commas)
          </label>
          <Textarea
            id="bulk-urls"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://example.com&#10;https://another-site.com&#10;suspicious-site.net"
            rows={6}
            disabled={isChecking}
            className="w-full resize-none bg-gray-800 border-cyan-800/30 text-cyan-100 placeholder:text-cyan-400/60"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose} 
            disabled={isChecking}
            className="border-cyan-600 text-cyan-100 bg-gray-800/50 hover:bg-cyan-600/20 hover:text-cyan-300"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isChecking}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            {isChecking ? 'Checking...' : 'Check All URLs'}
          </Button>
        </div>
      </form>
      
      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3 text-cyan-300">Results</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {results.map((result, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-md border flex items-start justify-between gap-2 ${
                  result.isSafe ? 'bg-green-900/30 border-green-400/30' : 
                  result.warningLevel === 'warning' ? 'bg-yellow-900/30 border-yellow-400/30' : 
                  'bg-red-900/30 border-red-400/30'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden min-w-0">
                  {getStatusIcon(result)}
                  <span className="text-sm truncate font-medium text-cyan-100">{result.url}</span>
                </div>
                <div className="text-xs whitespace-nowrap text-cyan-300">
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
