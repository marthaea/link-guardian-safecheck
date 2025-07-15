
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
    
    // Perform heuristic analysis first as backup
    const heuristicAnalysis = getSuspicionScore(input);
    console.log("Heuristic analysis result:", heuristicAnalysis);
    
    let apiData = null;
    let functionError = null;
    
    try {
      console.log("Attempting to call check-link function...");
      
      // Call the Supabase Edge Function with timeout
      const functionCall = supabase.functions.invoke('check-link', {
        body: { 
          input: input,
          userId: userId 
        }
      });
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Function call timeout')), 20000)
      );
      
      const { data, error } = await Promise.race([functionCall, timeoutPromise]) as any;
      
      if (error) {
        console.error("Supabase function error:", error);
        functionError = error;
        throw error;
      }
      
      console.log("Supabase function SUCCESS! Result:", data);
      apiData = data;
      
      // Validate the response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response from function');
      }
      
    } catch (error) {
      console.error("API call failed:", error);
      functionError = error;
    }
    
    let scanResult: ScanResult;
    
    // Determine the type properly
    const inputType: 'link' | 'email' = input.includes('@') ? 'email' : 'link';
    
    if (!apiData || functionError) {
      // Fall back to heuristic analysis only
      console.log("Using fallback heuristic-only analysis");
      
      scanResult = {
        url: input,
        isSafe: heuristicAnalysis.riskLevel === 'low',
        type: inputType,
        threatDetails: `⚠️ External verification services are currently unavailable. Analysis based on internal heuristics only.\n\n${formatHeuristicOnlyDetails(heuristicAnalysis)}`,
        warningLevel: heuristicAnalysis.riskLevel === 'low' ? 'safe' : heuristicAnalysis.riskLevel === 'medium' ? 'warning' : 'danger',
        timestamp: new Date(),
        riskScore: heuristicAnalysis.score,
        heuristicScore: heuristicAnalysis.score,
        heuristicRiskLevel: heuristicAnalysis.riskLevel,
      };
    } else {
      // SUCCESS! We have triple analysis results
      console.log("Processing triple analysis results");
      
      scanResult = {
        url: input,
        isSafe: apiData.isSafe,
        type: inputType,
        threatDetails: formatTripleAnalysisDetails(apiData),
        warningLevel: apiData.warningLevel,
        timestamp: new Date(),
        riskScore: apiData.riskScore,
        phishing: apiData.phishing,
        suspicious: apiData.suspicious,
        spamming: apiData.spamming,
        domainAge: apiData.domainAge,
        country: apiData.country,
        heuristicScore: apiData.heuristicAnalysis?.score || heuristicAnalysis.score,
        heuristicRiskLevel: apiData.heuristicAnalysis?.riskLevel || heuristicAnalysis.riskLevel,
      };
    }
    
    // Cache the result for consistent future checks
    linkCache.set(input, scanResult);
    
    // Ensure animation plays for at least 2 seconds
    await ensureMinimumAnimationTime(startTime);
    
    return scanResult;
  } catch (error) {
    console.error("Link checker error:", error);
    
    // Fall back to heuristic analysis only when everything fails
    const heuristicAnalysis = getSuspicionScore(input);
    const inputType: 'link' | 'email' = input.includes('@') ? 'email' : 'link';
    
    const fallbackResult: ScanResult = {
      url: input,
      isSafe: heuristicAnalysis.riskLevel === 'low',
      type: inputType,
      threatDetails: `⚠️ All external verification services are currently unavailable. Analysis based on internal heuristics only.\n\n${formatHeuristicOnlyDetails(heuristicAnalysis)}`,
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

// Format triple analysis results when API succeeds
function formatTripleAnalysisDetails(apiData: any): string {
  let details = [];
  
  details.push('🛡️ TRIPLE-LAYER SECURITY ANALYSIS COMPLETE');
  details.push('');
  
  // IPQS Analysis
  if (apiData.ipqsAnalysis) {
    details.push('🔍 IPQS Security Analysis:');
    if (apiData.ipqsAnalysis.risk_score > 70) {
      details.push('   ⚠️ HIGH RISK: Significant security concerns detected');
    } else if (apiData.ipqsAnalysis.risk_score > 30) {
      details.push('   ⚠️ MODERATE RISK: Some security concerns detected');
    } else {
      details.push('   ✅ LOW RISK: Minimal security concerns');
    }
    details.push(`   • Risk Score: ${apiData.ipqsAnalysis.risk_score}/100`);
    if (apiData.phishing) details.push('   • ⚠️ Phishing activity detected');
    if (apiData.suspicious) details.push('   • ⚠️ Suspicious behavior patterns');
    if (apiData.spamming) details.push('   • ⚠️ Spam activity detected');
  }
  
  details.push('');
  
  // VirusTotal Analysis
  if (apiData.virusTotalAnalysis) {
    details.push('🦠 VirusTotal Security Analysis:');
    if (apiData.virusTotalAnalysis.detected) {
      details.push(`   ⚠️ THREATS DETECTED: ${apiData.virusTotalAnalysis.positives}/${apiData.virusTotalAnalysis.total} security engines flagged this URL`);
    } else {
      details.push(`   ✅ CLEAN: 0/${apiData.virusTotalAnalysis.total} security engines detected threats`);
    }
  }
  
  details.push('');
  
  // Heuristic Analysis
  if (apiData.heuristicAnalysis) {
    details.push('🧠 Internal Heuristic Analysis:');
    details.push(`   • Suspicion Score: ${apiData.heuristicAnalysis.score}/100`);
    details.push(`   • Risk Assessment: ${apiData.heuristicAnalysis.riskLevel.toUpperCase()}`);
    
    if (apiData.heuristicAnalysis.factors && apiData.heuristicAnalysis.factors.length > 0) {
      details.push('   • Suspicious Patterns:');
      apiData.heuristicAnalysis.factors.forEach((factor: string) => {
        details.push(`     - ${factor}`);
      });
    } else {
      details.push('   • No suspicious patterns detected');
    }
  }
  
  details.push('');
  
  // Domain Information
  details.push('🌍 Domain Information:');
  if (apiData.domainAge) {
    details.push(`   📅 Domain Age: ${apiData.domainAge}`);
  }
  if (apiData.country) {
    details.push(`   🌍 Country: ${apiData.country}`);
  }
  
  details.push('');
  
  // Combined Assessment
  details.push('📊 Combined Security Assessment:');
  details.push(`   • Overall Risk Score: ${apiData.riskScore}/100`);
  details.push(`   • Security Status: ${apiData.isSafe ? 'SAFE' : 'POTENTIALLY UNSAFE'}`);
  details.push('   • Analysis Sources: IPQS + VirusTotal + Internal Heuristics');
  
  return details.join('\n');
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
