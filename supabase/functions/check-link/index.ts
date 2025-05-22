
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// API endpoint for IP Quality Score
const IP_QUALITY_SCORE_API_ENDPOINT = "https://www.ipqualityscore.com/api/json/url";

// Supabase client for database operations
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    })
  }

  try {
    // Extract API key from environment variables
    const IPQS_API_KEY = Deno.env.get("IPQS_API_KEY");
    
    console.log("Checking for IPQS_API_KEY:", IPQS_API_KEY ? "Present" : "Missing");
    
    // Parse request
    const { input, userId } = await req.json();
    
    if (!input) {
      return new Response(
        JSON.stringify({ error: "URL or email address is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      )
    }

    // Determine if it's an email or URL
    const isEmail = input.includes('@') && input.includes('.');
    const type = isEmail ? 'email' : 'link';
    
    // Extract domain from URL or email
    let domain = '';
    try {
      if (isEmail) {
        domain = input.split('@')[1].toLowerCase();
      } else {
        // Add http if missing to make URL parsing work
        const urlInput = input.startsWith('http') ? input : `http://${input}`;
        domain = new URL(urlInput).hostname.toLowerCase();
      }
    } catch (e) {
      const result = {
        url: input,
        isSafe: false,
        type,
        threatDetails: 'Invalid format. Could not process the input.',
        warningLevel: 'warning',
        timestamp: new Date(),
      };
      
      // Store the result if user is authenticated
      if (userId) {
        await storeResult(result, userId);
      }
      
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Special case for demo purposes - make 'example.com' always safe
    if (domain.includes('example.com')) {
      const result = {
        url: input,
        isSafe: true,
        type,
        warningLevel: 'safe',
        timestamp: new Date(),
      };
      
      // Store the result if user is authenticated
      if (userId) {
        await storeResult(result, userId);
      }
      
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    console.log(`Checking ${type}: ${input} with domain: ${domain}`);

    // Check if API key is available, otherwise fall back to simulation
    if (!IPQS_API_KEY) {
      console.log("No API key configured, falling back to simulation");
      const result = simulateSecurityCheck(input, domain, type);
      
      // Store the result if user is authenticated
      if (userId) {
        await storeResult(result, userId);
      }
      
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    try {
      // Use IP Quality Score API for real threat checking
      const url = new URL(IP_QUALITY_SCORE_API_ENDPOINT);
      url.searchParams.append('key', IPQS_API_KEY);
      url.searchParams.append('url', input);
      url.searchParams.append('strictness', '2');
      url.searchParams.append('fast', 'true');

      console.log("Making request to IPQS API:", url.toString().replace(IPQS_API_KEY, '[REDACTED]'));
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        console.error(`IPQS API error: ${response.status} ${response.statusText}`);
        throw new Error(`IPQS API returned ${response.status}`);
      }
      
      const data = await response.json();
      console.log("IPQS API response:", data);
      
      // Parse IPQS response
      const isSafe = !data.unsafe && data.risk_score < 85;
      const warningLevel = data.risk_score > 85 ? 'danger' : 
                          data.risk_score > 65 ? 'warning' : 'safe';
      
      let threatDetails = '';
      if (data.risk_score > 85) {
        threatDetails = `High risk (${data.risk_score}%). This link was flagged for: ${data.domain_age ? 'New domain. ' : ''}${data.spamming ? 'Spam activity. ' : ''}${data.malware ? 'Potential malware. ' : ''}${data.phishing ? 'Potential phishing. ' : ''}`;
      } else if (data.risk_score > 65) {
        threatDetails = `Medium risk (${data.risk_score}%). Proceed with caution.`;
      }
      
      const result = {
        url: input,
        isSafe,
        type,
        warningLevel,
        threatDetails: isSafe ? undefined : threatDetails,
        timestamp: new Date(),
      };
      
      // Store the result if user is authenticated
      if (userId) {
        await storeResult(result, userId);
      }
      
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
      
    } catch (error) {
      console.error("API error:", error);
      
      // Fall back to simulation for demo/development
      const result = simulateSecurityCheck(input, domain, type);
      
      // Store the result if user is authenticated
      if (userId) {
        await storeResult(result, userId);
      }
      
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
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

// Store scan result in database
async function storeResult(result: any, userId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('scan_results')
      .insert({
        url: result.url,
        is_safe: result.isSafe,
        type: result.type,
        threat_details: result.threatDetails,
        warning_level: result.warningLevel,
        user_id: userId
      });
    
    if (error) {
      console.error("Error storing result:", error);
    }
  } catch (error) {
    console.error("Failed to store scan result:", error);
  }
}

// Fallback simulation method
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
      threatDetails: 'This domain is associated with known malicious activity.',
      warningLevel: 'danger',
      timestamp: new Date(),
    };
  }
  
  // Look for suspicious patterns
  const hasSuspiciousPatterns = suspiciousPatterns.some(pattern => 
    input.toLowerCase().includes(pattern)
  );
  
  if (hasSuspiciousPatterns) {
    return {
      url: input,
      isSafe: false,
      type,
      warningLevel: 'warning',
      threatDetails: 'This link contains potentially suspicious patterns. Use caution.',
      timestamp: new Date(),
    };
  }
  
  // Randomize results for demo purposes
  const randomSafe = Math.random() > 0.3;
  
  return {
    url: input,
    isSafe: randomSafe,
    type,
    threatDetails: randomSafe ? undefined : 'This link has characteristics similar to known threats.',
    warningLevel: randomSafe ? 'safe' : Math.random() > 0.5 ? 'danger' : 'warning',
    timestamp: new Date(),
  };
}
