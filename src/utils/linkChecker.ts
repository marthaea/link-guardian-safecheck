
import { ScanResult } from "../components/ScanResults";
import { supabase } from "@/integrations/supabase/client";
import { getSuspicionScore, combineAnalysis } from "./suspiciousUrlScorer";

export const checkLink = async (input: string): Promise<ScanResult> => {
  try {
    // Start animation for at least 2 seconds
    const startTime = Date.now();
    
    // Get current user if logged in
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    
    console.log("Calling Supabase Edge Function to check link:", input);
    
    // Perform heuristic analysis first
    const heuristicAnalysis = getSuspicionScore(input);
    console.log("Heuristic analysis result:", heuristicAnalysis);
    
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
    
    // Combine API results with heuristic analysis
    const combinedResults = combineAnalysis(data, heuristicAnalysis);
    
    // Transform the response to our ScanResult format with detailed information
    const scanResult: ScanResult = {
      url: input,
      isSafe: combinedResults.isSafe,
      type: input.includes('@') ? 'email' : 'link',
      threatDetails: combinedResults.combinedThreatDetails,
      warningLevel: determineCombinedWarningLevel(data, heuristicAnalysis),
      timestamp: new Date(),
      riskScore: combinedResults.riskScore,
      phishing: data.phishing,
      suspicious: data.suspicious,
      spamming: data.spamming,
      domainAge: data.domainAge,
      country: data.country,
      heuristicScore: heuristicAnalysis.score,
      heuristicRiskLevel: heuristicAnalysis.riskLevel,
    };
    
    // Ensure animation plays for at least 2 seconds
    await ensureMinimumAnimationTime(startTime);
    
    return scanResult;
  } catch (error) {
    console.error("Link checker error:", error);
    
    // Fall back to heuristic analysis only when API fails
    const heuristicAnalysis = getSuspicionScore(input);
    
    return {
      url: input,
      isSafe: heuristicAnalysis.riskLevel === 'low',
      type: input.includes('@') ? 'email' : 'link',
      threatDetails: `⚠️ External verification temporarily unavailable. Analysis based on internal heuristics only.\n\n${formatHeuristicOnlyDetails(heuristicAnalysis)}`,
      warningLevel: heuristicAnalysis.riskLevel === 'low' ? 'safe' : heuristicAnalysis.riskLevel === 'medium' ? 'warning' : 'danger',
      timestamp: new Date(),
      riskScore: heuristicAnalysis.score,
      heuristicScore: heuristicAnalysis.score,
      heuristicRiskLevel: heuristicAnalysis.riskLevel,
    };
  }
};

// Determine combined warning level based on both API and heuristic results
function determineCombinedWarningLevel(apiData: any, heuristicAnalysis: any): 'safe' | 'warning' | 'danger' {
  const apiWarningLevel = apiData.warningLevel || (apiData.isSafe ? 'safe' : 'danger');
  const heuristicWarningLevel = heuristicAnalysis.riskLevel === 'low' ? 'safe' : 
                               heuristicAnalysis.riskLevel === 'medium' ? 'warning' : 'danger';
  
  // Return the more severe warning level
  if (apiWarningLevel === 'danger' || heuristicWarningLevel === 'danger') {
    return 'danger';
  } else if (apiWarningLevel === 'warning' || heuristicWarningLevel === 'warning') {
    return 'warning';
  } else {
    return 'safe';
  }
}

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
