
import { ScanResult } from "../components/ScanResults";
import { supabase } from "@/integrations/supabase/client";
import { getSuspicionScore, combineAnalysis } from "./suspiciousUrlScorer";

// Simple in-memory cache for consistent results
const linkCache = new Map<string, ScanResult>();

export const checkLink = async (input: string): Promise<ScanResult> => {
  try {
    // Check cache first for consistent results
    if (linkCache.has(input)) {
      console.log("Returning cached result for:", input);
      return linkCache.get(input)!;
    }

    // Start animation for at least 2 seconds
    const startTime = Date.now();
    
    // Get current user if logged in
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    
    console.log("Calling Supabase Edge Function to check link:", input);
    
    // Perform heuristic analysis first
    const heuristicAnalysis = getSuspicionScore(input);
    console.log("Heuristic analysis result:", heuristicAnalysis);
    
    // Check if user is offline
    const isOffline = !navigator.onLine;
    
    let apiData = null;
    let offlineMode = false;
    
    if (!isOffline) {
      try {
        // Call the Supabase Edge Function
        const { data, error } = await supabase.functions.invoke('check-link', {
          body: { 
            input: input,
            userId: userId 
          }
        });
        
        if (error) {
          console.error("Supabase function error:", error);
          throw error;
        }
        
        console.log("Supabase function result:", data);
        apiData = data;
      } catch (error) {
        console.error("API call failed, falling back to heuristic only:", error);
        offlineMode = true;
      }
    } else {
      console.log("User is offline, using heuristic analysis only");
      offlineMode = true;
    }
    
    let scanResult: ScanResult;
    
    // Determine the type properly
    const inputType: 'link' | 'email' = input.includes('@') ? 'email' : 'link';
    
    if (offlineMode || !apiData) {
      // Fall back to heuristic analysis only
      scanResult = {
        url: input,
        isSafe: heuristicAnalysis.riskLevel === 'low',
        type: inputType,
        threatDetails: `${isOffline ? '🔌 You are currently offline. ' : '⚠️ External verification temporarily unavailable. '}Analysis based on internal heuristics only.\n\n${formatHeuristicOnlyDetails(heuristicAnalysis)}`,
        warningLevel: heuristicAnalysis.riskLevel === 'low' ? 'safe' : heuristicAnalysis.riskLevel === 'medium' ? 'warning' : 'danger',
        timestamp: new Date(),
        riskScore: heuristicAnalysis.score,
        heuristicScore: heuristicAnalysis.score,
        heuristicRiskLevel: heuristicAnalysis.riskLevel,
      };
    } else {
      // Combine API results with heuristic analysis
      const combinedResults = combineAnalysis(apiData, heuristicAnalysis);
      
      // Transform the response to our ScanResult format with detailed information
      scanResult = {
        url: input,
        isSafe: combinedResults.isSafe,
        type: inputType,
        threatDetails: combinedResults.combinedThreatDetails,
        warningLevel: combinedResults.warningLevel,
        timestamp: new Date(),
        riskScore: combinedResults.riskScore,
        phishing: apiData.phishing,
        suspicious: apiData.suspicious,
        spamming: apiData.spamming,
        domainAge: apiData.domainAge,
        country: apiData.country,
        heuristicScore: heuristicAnalysis.score,
        heuristicRiskLevel: heuristicAnalysis.riskLevel,
      };
    }
    
    // Cache the result for consistent future checks
    linkCache.set(input, scanResult);
    
    // Ensure animation plays for at least 2 seconds
    await ensureMinimumAnimationTime(startTime);
    
    return scanResult;
  } catch (error) {
    console.error("Link checker error:", error);
    
    // Fall back to heuristic analysis only when API fails
    const heuristicAnalysis = getSuspicionScore(input);
    const inputType: 'link' | 'email' = input.includes('@') ? 'email' : 'link';
    
    const fallbackResult: ScanResult = {
      url: input,
      isSafe: heuristicAnalysis.riskLevel === 'low',
      type: inputType,
      threatDetails: `⚠️ External verification temporarily unavailable. Analysis based on internal heuristics only.\n\n${formatHeuristicOnlyDetails(heuristicAnalysis)}`,
      warningLevel: heuristicAnalysis.riskLevel === 'low' ? 'safe' : heuristicAnalysis.riskLevel === 'medium' ? 'warning' : 'danger',
      timestamp: new Date(),
      riskScore: heuristicAnalysis.score,
      heuristicScore: heuristicAnalysis.score,
      heuristicRiskLevel: heuristicAnalysis.riskLevel,
    };
    
    // Cache the fallback result too
    linkCache.set(input, fallbackResult);
    
    return fallbackResult;
  }
};

// Format heuristic-only analysis for display when API fails
function formatHeuristicOnlyDetails(heuristicAnalysis: any): string {
  let details = [];
  
  details.push('🧠 Internal Heuristic Analysis:');
  details.push(`   • Suspicion Score: ${heuristicAnalysis.score}/100`);
  details.push(`   • Risk Level: ${heuristicAnalysis.riskLevel.toUpperCase()}`);
  
  if (heuristicAnalysis.factors.length > 0) {
    details.push('   • Suspicious Factors Found:');
    heuristicAnalysis.factors.forEach((factor: string) => {
      details.push(`     - ${factor}`);
    });
  } else {
    details.push('   • No suspicious patterns detected');
  }
  
  details.push('');
  details.push('💡 Recommendation:');
  details.push(heuristicAnalysis.explanation);
  
  return details.join('\n');
}

// Ensure the animation displays for at least 2 seconds for UX purposes
async function ensureMinimumAnimationTime(startTime: number): Promise<void> {
  const elapsedTime = Date.now() - startTime;
  const remainingTime = Math.max(0, 2000 - elapsedTime);
  
  if (remainingTime > 0) {
    await new Promise(resolve => setTimeout(resolve, remainingTime));
  }
}
