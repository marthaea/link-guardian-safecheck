
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
    
    console.log("🛡️ Starting TRIPLE-LAYER SECURITY ANALYSIS for:", input);
    
    // Use Supabase Edge Function for proper API calls
    const { data, error } = await supabase.functions.invoke('check-link', {
      body: { input, userId: 'anonymous' }
    });

    if (error) {
      console.error("Edge function error:", error);
      throw new Error("Analysis service unavailable");
    }

    console.log("✅ Edge function response:", data);

    // Convert edge function response to ScanResult format
    const scanResult: ScanResult = {
      url: data.url || input,
      isSafe: data.isSafe || false,
      type: data.type || (input.includes('@') ? 'email' : 'link'),
      threatDetails: formatEdgeFunctionDetails(data),
      warningLevel: data.warningLevel || 'warning',
      timestamp: new Date(data.timestamp) || new Date(),
      riskScore: data.riskScore || 50,
      phishing: data.phishing || false,
      suspicious: data.suspicious || false,
      spamming: data.spamming || false,
      domainAge: data.domainAge || 'Unknown',
      country: data.country || 'Unknown',
      heuristicScore: data.heuristicAnalysis?.score || 0,
      heuristicRiskLevel: data.heuristicAnalysis?.riskLevel || 'medium',
    };
    
    // Cache the result for consistent future checks
    linkCache.set(input, scanResult);
    
    // Ensure animation plays for at least 2 seconds
    await ensureMinimumAnimationTime(startTime);
    
    return scanResult;
  } catch (error) {
    console.error("Link checker error:", error);
    
    // Fall back to enhanced heuristic analysis only when edge function fails
    const heuristicAnalysis = getSuspicionScore(input);
    const inputType: 'link' | 'email' = input.includes('@') ? 'email' : 'link';
    
    // Make fallback more strict - don't trust unknown links
    const adjustedSafety = heuristicAnalysis.riskLevel === 'low' && heuristicAnalysis.score < 20;
    
    const fallbackResult: ScanResult = {
      url: input,
      isSafe: adjustedSafety,
      type: inputType,
      threatDetails: `⚠️ Analysis service unavailable. Using enhanced heuristic analysis only.\n\n${formatHeuristicOnlyDetails(heuristicAnalysis)}\n\n⚠️ CAUTION: Without external API verification, exercise extra caution with this link.`,
      warningLevel: adjustedSafety ? 'safe' : heuristicAnalysis.riskLevel === 'medium' ? 'warning' : 'danger',
      timestamp: new Date(),
      riskScore: Math.min(100, heuristicAnalysis.score + 20), // Add penalty for no API verification
      heuristicScore: heuristicAnalysis.score,
      heuristicRiskLevel: heuristicAnalysis.riskLevel,
    };
    
    // Cache the fallback result too
    linkCache.set(input, fallbackResult);
    
    return fallbackResult;
  }
};

// Format edge function response for display
function formatEdgeFunctionDetails(data: any): string {
  let details = [];
  
  details.push('🛡️ COMPREHENSIVE SECURITY ANALYSIS COMPLETE');
  details.push('');
  
  // IPQS Analysis
  if (data.ipqsAnalysis) {
    details.push('🔍 IPQS Security Analysis:');
    const riskScore = data.ipqsAnalysis.risk_score || 0;
    if (riskScore > 70) {
      details.push('   ⚠️ HIGH RISK: Significant security concerns detected');
    } else if (riskScore > 30) {
      details.push('   ⚠️ MODERATE RISK: Some security concerns detected');
    } else {
      details.push('   ✅ LOW RISK: Minimal security concerns');
    }
    details.push(`   • Risk Score: ${riskScore}/100`);
    if (data.phishing) details.push('   • ⚠️ Phishing activity detected');
    if (data.suspicious) details.push('   • ⚠️ Suspicious behavior patterns');
    if (data.spamming) details.push('   • ⚠️ Spam activity detected');
  } else {
    details.push('🔍 IPQS Security Analysis: Service unavailable');
  }
  
  details.push('');
  
  // VirusTotal Analysis
  if (data.virusTotalAnalysis) {
    details.push('🦠 VirusTotal Security Analysis:');
    if (data.virusTotalAnalysis.detected) {
      details.push(`   ⚠️ THREATS DETECTED: ${data.virusTotalAnalysis.positives}/${data.virusTotalAnalysis.total} security engines flagged this URL`);
    } else {
      details.push(`   ✅ CLEAN: 0/${data.virusTotalAnalysis.total} security engines detected threats`);
    }
  } else {
    details.push('🦠 VirusTotal Security Analysis: Service unavailable');
  }
  
  details.push('');
  
  // Heuristic Analysis
  if (data.heuristicAnalysis) {
    details.push('🧠 Enhanced Heuristic Analysis:');
    details.push(`   • Suspicion Score: ${data.heuristicAnalysis.score}/100`);
    details.push(`   • Risk Assessment: ${data.heuristicAnalysis.riskLevel.toUpperCase()}`);
    
    if (data.heuristicAnalysis.factors && data.heuristicAnalysis.factors.length > 0) {
      details.push('   • Security Patterns Detected:');
      data.heuristicAnalysis.factors.forEach((factor: string) => {
        details.push(`     - ${factor}`);
      });
    } else {
      details.push('   • No suspicious patterns detected');
    }
  }
  
  details.push('');
  
  // Domain Information
  details.push('🌍 Domain Information:');
  if (data.domainAge) {
    details.push(`   📅 Domain Age: ${data.domainAge}`);
  }
  if (data.country) {
    details.push(`   🌍 Country: ${data.country}`);
  }
  
  details.push('');
  
  // Combined Assessment
  details.push('📊 Final Security Assessment:');
  details.push(`   • Combined Risk Score: ${data.riskScore}/100`);
  details.push(`   • Security Status: ${data.isSafe ? 'SAFE' : 'POTENTIALLY UNSAFE'}`);
  details.push('   • Analysis Sources: IPQS + VirusTotal + Enhanced Heuristics');
  
  details.push('');
  details.push('💡 Recommendation:');
  if (data.warningLevel === 'safe') {
    details.push('   This link appears safe based on comprehensive analysis.');
  } else if (data.warningLevel === 'warning') {
    details.push('   ⚠️ Exercise caution. Verify source and avoid sensitive information.');
  } else {
    details.push('   🚨 AVOID this link. High security risk detected.');
  }
  
  return details.join('\n');
}

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
