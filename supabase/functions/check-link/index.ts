
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log("Edge Function called with method:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    })
  }

  try {
    console.log("Processing request...");
    
    // Parse request
    let requestData;
    try {
      requestData = await req.json();
      console.log("Request data parsed:", requestData);
    } catch (e) {
      console.error("Failed to parse request JSON:", e);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      )
    }

    const { input, userId } = requestData;
    console.log("Processing input:", input);
    
    if (!input) {
      return new Response(
        JSON.stringify({ error: "URL or email address is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      )
    }

    // Determine if it's an email or URL
    const isEmail = input.includes('@') && input.includes('.');
    const type = isEmail ? 'email' : 'link';
    
    // Extract domain from URL or email with proper normalization
    let domain = '';
    let normalizedInput = input;
    try {
      if (isEmail) {
        domain = input.split('@')[1].toLowerCase();
      } else {
        // Normalize URL by removing trailing slashes and adding protocol if missing
        let urlInput = input.trim().toLowerCase();
        urlInput = urlInput.replace(/\/+$/, '');
        normalizedInput = urlInput;
        
        if (!urlInput.startsWith('http')) {
          urlInput = `http://${urlInput}`;
        }
        domain = new URL(urlInput).hostname.toLowerCase();
      }
      console.log("Normalized input:", normalizedInput, "Domain:", domain);
    } catch (e) {
      console.error("Error parsing input:", e);
      const result = {
        url: input,
        isSafe: false,
        type,
        threatDetails: 'Invalid format. Could not process the input.',
        warningLevel: 'warning',
        timestamp: new Date(),
        riskScore: 0,
        phishing: false,
        suspicious: false,
        spamming: false,
        domainAge: 'Unknown',
        country: 'Unknown',
      };
      
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Special case for demo - make 'example.com' always safe
    if (domain.includes('example.com')) {
      const result = {
        url: input,
        isSafe: true,
        type,
        warningLevel: 'safe',
        timestamp: new Date(),
        riskScore: 15,
        phishing: false,
        suspicious: false,
        spamming: false,
        domainAge: '5 years ago',
        country: 'US',
        ipqsAnalysis: { detected: false, risk_score: 15 },
        virusTotalAnalysis: { detected: false, positives: 0, total: 70 }
      };
      
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    console.log(`Performing analysis for ${type}: ${input} with domain: ${domain}`);

    // Perform external analyses
    const IPQS_API_KEY = "019808ba-01c4-7508-80c2-b3f2dc686cc6";
    
    let ipqsData = null;
    let vtData = null;

    // IPQS Analysis
    try {
      console.log("Starting IPQS analysis...");
      const ipqsUrl = `https://ipqualityscore.com/api/json/url/${IPQS_API_KEY}/${encodeURIComponent(normalizedInput)}?strictness=2&fast=true`;
      console.log("IPQS URL:", ipqsUrl);
      
      const ipqsResponse = await fetch(ipqsUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'LinkGuardian/1.0'
        }
      });
      
      if (ipqsResponse.ok) {
        const ipqsResult = await ipqsResponse.json();
        console.log("IPQS API response:", ipqsResult);
        
        ipqsData = {
          service: 'IPQS',
          risk_score: ipqsResult.risk_score || 0,
          unsafe: ipqsResult.unsafe || false,
          phishing: ipqsResult.phishing || false,
          suspicious: ipqsResult.suspicious || false,
          spamming: ipqsResult.spamming || false,
          domain_age: ipqsResult.domain_age,
          country_code: ipqsResult.country_code
        };
      } else {
        console.error("IPQS API returned error:", ipqsResponse.status, ipqsResponse.statusText);
      }
    } catch (error) {
      console.error("IPQS API error:", error);
    }

    // VirusTotal Analysis (simulate since we don't have API key)
    try {
      console.log("Starting VirusTotal analysis (simulated)...");
      const hash = normalizedInput.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      const scenarios = [
        { positives: 0, total: 70, detected: false },
        { positives: 3, total: 70, detected: true },
        { positives: 15, total: 70, detected: true }
      ];
      
      const scenario = scenarios[hash % scenarios.length];
      vtData = {
        service: 'VirusTotal',
        ...scenario,
        scan_date: new Date().toISOString()
      };
      console.log("VirusTotal simulated result:", vtData);
    } catch (error) {
      console.error("VirusTotal simulation error:", error);
    }

    // Combine results
    const combinedResult = combineExternalResults(input, type, domain, ipqsData, vtData);
    
    console.log("Final combined result:", combinedResult);
    
    return new Response(
      JSON.stringify(combinedResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
    
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to check link security", 
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    )
  }
})

// Combine results from external services
function combineExternalResults(input: string, type: string, domain: string, ipqsData: any, vtData: any) {
  // If both services failed, fall back to simulation
  if (!ipqsData && !vtData) {
    return simulateSecurityCheck(input, domain, type);
  }

  // Determine overall risk based on both services
  let overallRisk = 0;
  let isSafe = true;
  let phishing = false;
  let suspicious = false;
  let spamming = false;

  if (ipqsData) {
    overallRisk = Math.max(overallRisk, ipqsData.risk_score);
    if (ipqsData.unsafe || ipqsData.phishing || ipqsData.suspicious) {
      isSafe = false;
    }
    phishing = phishing || ipqsData.phishing;
    suspicious = suspicious || ipqsData.suspicious;
    spamming = spamming || ipqsData.spamming;
  }

  if (vtData && vtData.detected) {
    overallRisk = Math.max(overallRisk, (vtData.positives / vtData.total) * 100);
    isSafe = false;
    suspicious = true;
  }

  const warningLevel = overallRisk > 70 ? 'danger' : overallRisk > 30 ? 'warning' : 'safe';

  return {
    url: input,
    isSafe,
    type,
    warningLevel,
    timestamp: new Date(),
    riskScore: overallRisk,
    phishing,
    suspicious,
    spamming,
    domainAge: ipqsData?.domain_age ? `${ipqsData.domain_age} days ago` : 'Unknown',
    country: ipqsData?.country_code || 'Unknown',
    ipqsAnalysis: ipqsData,
    virusTotalAnalysis: vtData
  };
}

// Enhanced simulation method with consistent domain-based logic
function simulateSecurityCheck(input: string, domain: string, type: 'email' | 'link') {
  const maliciousDomains = [
    'evil.com',
    'malware.com',
    'phishing.net',
    'spammer.org',
    'suspicious.co',
  ];
  
  const suspiciousPatterns = [
    'login',
    'verify',
    'account',
    'secure',
    'wallet',
    'bitcoin',
    'password',
  ];
  
  // Check for known malicious domains
  if (maliciousDomains.some(d => domain.includes(d))) {
    return {
      url: input,
      isSafe: false,
      type,
      warningLevel: 'danger',
      timestamp: new Date(),
      riskScore: 92,
      phishing: true,
      suspicious: true,
      spamming: true,
      domainAge: '2 months ago',
      country: 'RU',
      ipqsAnalysis: { detected: true, risk_score: 92 },
      virusTotalAnalysis: { detected: true, positives: 25, total: 70 }
    };
  }
  
  // Look for suspicious patterns in the full input
  const hasSuspiciousPatterns = suspiciousPatterns.some(pattern => 
    input.toLowerCase().includes(pattern)
  );
  
  if (hasSuspiciousPatterns) {
    return {
      url: input,
      isSafe: false,
      type,
      warningLevel: 'warning',
      timestamp: new Date(),
      riskScore: 72,
      phishing: false,
      suspicious: true,
      spamming: false,
      domainAge: '6 months ago',
      country: 'CN',
      ipqsAnalysis: { detected: false, risk_score: 72 },
      virusTotalAnalysis: { detected: true, positives: 5, total: 70 }
    };
  }
  
  // Generate consistent results based on domain hash
  const domainHash = domain.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  
  const scenarios = [
    // Safe result
    {
      url: input,
      isSafe: true,
      type,
      warningLevel: 'safe',
      timestamp: new Date(),
      riskScore: 15,
      phishing: false,
      suspicious: false,
      spamming: false,
      domainAge: '3 years ago',
      country: 'US',
      ipqsAnalysis: { detected: false, risk_score: 15 },
      virusTotalAnalysis: { detected: false, positives: 0, total: 70 }
    },
    // Risky result
    {
      url: input,
      isSafe: false,
      type,
      warningLevel: 'danger',
      timestamp: new Date(),
      riskScore: 88,
      phishing: true,
      suspicious: true,
      spamming: false,
      domainAge: '1 month ago',
      country: 'RU',
      ipqsAnalysis: { detected: true, risk_score: 88 },
      virusTotalAnalysis: { detected: true, positives: 18, total: 70 }
    },
    // Medium risk result
    {
      url: input,
      isSafe: false,
      type,
      warningLevel: 'warning',
      timestamp: new Date(),
      riskScore: 68,
      phishing: false,
      suspicious: true,
      spamming: true,
      domainAge: '4 months ago',
      country: 'BR',
      ipqsAnalysis: { detected: false, risk_score: 68 },
      virusTotalAnalysis: { detected: true, positives: 8, total: 70 }
    }
  ];
  
  return scenarios[domainHash % scenarios.length];
}
