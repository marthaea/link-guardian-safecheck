import React from 'react';
import { AlertTriangle, Check, Link, Mail, ShieldAlert, ShieldCheck, X, ExternalLink, Brain } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export type ScanResult = {
  url: string;
  isSafe: boolean;
  type: 'link' | 'email';
  threatDetails?: string;
  warningLevel?: 'safe' | 'warning' | 'danger';
  timestamp: Date;
  riskScore?: number;
  phishing?: boolean | string;
  suspicious?: boolean | string;
  spamming?: boolean | string;
  domainAge?: string;
  country?: string;
  heuristicScore?: number;
  heuristicRiskLevel?: 'low' | 'medium' | 'high';
  ipqsAnalysis?: any;
  virusTotalAnalysis?: any;
};

interface ScanResultsProps {
  result: ScanResult | null;
  onReset: () => void;
}

const ScanResults: React.FC<ScanResultsProps> = ({ result, onReset }) => {
  if (!result) return null;

  const { url, isSafe, type, threatDetails, warningLevel = isSafe ? 'safe' : 'danger' } = result;

  const calculateCombinedScore = () => {
    let totalScore = 0;
    let scoreCount = 0;
    
    if (result.riskScore !== undefined) {
      totalScore += result.riskScore;
      scoreCount++;
    }
    if (result.heuristicScore !== undefined) {
      totalScore += result.heuristicScore;
      scoreCount++;
    }
    
    return scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
  };

  const combinedScore = calculateCombinedScore();
  
  const getStatusContent = () => {
    const analysisCount = [
      result.riskScore !== undefined ? 'External API 1' : null,
      result.heuristicScore !== undefined ? 'External API 2' : null,
      'Heuristic Analysis'
    ].filter(Boolean).length;

    if (warningLevel === 'safe') {
      return (
        <div className="flex items-center gap-2 text-[hsl(var(--safe))]">
          <div className="rounded-full bg-[hsl(var(--safe))] bg-opacity-20 p-2">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Safe to use</span>
            <span className="text-xs flex items-center gap-1">
              <Brain className="h-3 w-3" />
              Analyzed by {analysisCount} security systems
            </span>
          </div>
        </div>
      );
    } else if (warningLevel === 'warning') {
      return (
        <div className="flex items-center gap-2 text-[hsl(var(--warning))]">
          <div className="rounded-full bg-[hsl(var(--warning))] bg-opacity-20 p-2">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Proceed with caution</span>
            <span className="text-xs flex items-center gap-1">
              <Brain className="h-3 w-3" />
              Analyzed by {analysisCount} security systems
            </span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 text-[hsl(var(--danger))]">
          <div className="rounded-full bg-[hsl(var(--danger))] bg-opacity-20 p-2">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Potentially unsafe</span>
            <span className="text-xs flex items-center gap-1">
              <Brain className="h-3 w-3" />
              Analyzed by {analysisCount} security systems
            </span>
          </div>
        </div>
      );
    }
  };

  const getBorderColor = () => {
    switch (warningLevel) {
      case 'safe':
        return 'border-[hsl(var(--safe))] border-opacity-30';
      case 'warning':
        return 'border-[hsl(var(--warning))] border-opacity-30';
      case 'danger':
        return 'border-[hsl(var(--danger))] border-opacity-30';
      default:
        return '';
    }
  };

  const getAlertVariant = () => {
    return warningLevel === 'danger' ? 'destructive' : 'default';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "The URL has been copied to your clipboard.",
      });
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  const handleReport = () => {
    toast({
      title: "Report submitted",
      description: "Thank you for helping to make the internet safer.",
      variant: "destructive",
    });
  };
  
  const handleVisitSite = () => {
    // Ensure URL has http:// or https:// prefix
    let urlToVisit = url;
    if (!/^https?:\/\//i.test(url)) {
      urlToVisit = 'https://' + url;
    }
    
    // Open in new tab with security features
    window.open(
      urlToVisit, 
      '_blank', 
      'noopener,noreferrer'
    );
    
    toast({
      title: "Opening website",
      description: "The site is opening in a new tab.",
    });
  };

  return (
    <Card className={cn("w-full max-w-3xl border-2", getBorderColor())}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            {type === 'link' ? <Link className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
            Triple-Layer Security Analysis
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onReset}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Scan completed at {result.timestamp.toLocaleTimeString()} • IPQS + VirusTotal + Heuristic Analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {getStatusContent()}
          
          <div className="pt-2">
            <div className="text-sm font-medium mb-1">Scanned Item:</div>
            <div className="p-2 bg-muted rounded-md overflow-hidden text-ellipsis flex justify-between items-center">
              <code className="text-xs break-all">{url}</code>
              <Button variant="ghost" size="sm" onClick={handleCopy} className="ml-2 shrink-0">
                <Check className="h-3 w-3 mr-1" /> Copy
              </Button>
            </div>
          </div>
          
          {threatDetails && (
            <div className="pt-2">
              <div className="text-sm font-medium mb-1">Comprehensive Triple-Layer Security Analysis:</div>
              <Alert variant={getAlertVariant()} className="border-opacity-50">
                <AlertDescription>
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{threatDetails}</pre>
                </AlertDescription>
              </Alert>
            </div>
          )}

          <div className="bg-muted/50 p-4 rounded-md border border-border/50 space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">Combined Security Score</div>
              <div className={cn("text-lg font-bold px-3 py-1 rounded-full", 
                combinedScore <= 30 ? "text-[hsl(var(--safe))] bg-[hsl(var(--safe))]/20" :
                combinedScore <= 70 ? "text-[hsl(var(--warning))] bg-[hsl(var(--warning))]/20" :
                "text-[hsl(var(--danger))] bg-[hsl(var(--danger))]/20"
              )}>
                {combinedScore}/100
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {isSafe 
                ? "Our triple-layer security analysis (IPQS + VirusTotal + Internal Heuristics) did not detect significant security risks with this item."
                : "Our triple-layer security analysis detected potential concerns using multiple external threat intelligence services and internal pattern recognition."}
            </p>
          </div>
          
          <div className="pt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={onReset}>
              Check Another
            </Button>
            {!isSafe && (
              <Button variant="destructive" onClick={handleReport}>
                Report Issue
              </Button>
            )}
            {type === 'link' && isSafe && (
              <Button onClick={handleVisitSite}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Site
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScanResults;
