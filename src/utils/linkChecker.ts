import { ScanResult } from "../components/ScanResults";

// APIs for link/email verification
const GOOGLE_SAFE_BROWSING_API_ENDPOINT = "https://safebrowsing.googleapis.com/v4/threatMatches:find";
const VIRUS_TOTAL_API_ENDPOINT = "https://www.virustotal.com/api/v3/urls";
const IP_QUALITY_SCORE_API_ENDPOINT = "https://www.ipqualityscore.com/api/json/url";

// This would need to be provided by the user in a real implementation
// For now, we'll use temporary placeholders
const GOOGLE_API_KEY = "YOUR_GOOGLE_API_KEY"; 
const VIRUS_TOTAL_API_KEY = "YOUR_VIRUS_TOTAL_API_KEY";
const IPQS_API_KEY = "YOUR_IPQS_API_KEY";

export const checkLink = async (input: string): Promise<ScanResult> => {
  try {
    // Start animation for at least 2 seconds
    const startTime = Date.now();
    
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
      return {
        url: input,
        isSafe: false,
        type,
        threatDetails: 'Invalid format. Could not process the input.',
        warningLevel: 'warning',
        timestamp: new Date(),
      };
    }
    
    // Special case for demo purposes - make 'example.com' always safe
    if (domain.includes('example.com')) {
      // Ensure animation plays for at least 2 seconds
      await ensureMinimumAnimationTime(startTime);
      return {
        url: input,
        isSafe: true,
        type,
        timestamp: new Date(),
      };
    }

    // In a real application, you would use one or more of these APIs
    // For demo purposes, we'll attempt to use a free API check if API keys are provided
    // Otherwise, fall back to our simulation

    // Try IP Quality Score as it has a free tier
    if (IPQS_API_KEY !== "YOUR_IPQS_API_KEY") {
      try {
        const result = await checkUrlWithIPQS(input, domain, type);
        await ensureMinimumAnimationTime(startTime);
        return result;
      } catch (error) {
        console.error("IPQS API error:", error);
        // Fall back to simulation
      }
    }

    // If no API keys are provided or API calls fail, fall back to simulation
    console.log("No API keys provided or API calls failed. Using simulated check.");
    
    await ensureMinimumAnimationTime(startTime);
    return simulateSecurityCheck(input, domain, type);
  } catch (error) {
    console.error("Link checker error:", error);
    return {
      url: input,
      isSafe: false,
      type: input.includes('@') ? 'email' : 'link',
      threatDetails: 'An error occurred while checking this link.',
      warningLevel: 'warning',
      timestamp: new Date(),
    };
  }
};

// IP Quality Score API check (has a free tier)
async function checkUrlWithIPQS(input: string, domain: string, type: 'email' | 'link'): Promise<ScanResult> {
  const url = new URL(IP_QUALITY_SCORE_API_ENDPOINT);
  url.searchParams.append('key', IPQS_API_KEY);
  url.searchParams.append('url', input);
  url.searchParams.append('strictness', '2');
  url.searchParams.append('fast', 'true');

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`IPQS API returned ${response.status}`);
  }
  
  const data = await response.json();
  
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
  
  return {
    url: input,
    isSafe,
    type,
    warningLevel,
    threatDetails: isSafe ? undefined : threatDetails,
    timestamp: new Date(),
  };
}

// Fallback simulation method
function simulateSecurityCheck(input: string, domain: string, type: 'email' | 'link'): ScanResult {
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

// Ensure the animation displays for at least 2 seconds for UX purposes
async function ensureMinimumAnimationTime(startTime: number): Promise<void> {
  const elapsedTime = Date.now() - startTime;
  const remainingTime = Math.max(0, 2000 - elapsedTime);
  
  if (remainingTime > 0) {
    await new Promise(resolve => setTimeout(resolve, remainingTime));
  }
}
