
export interface SuspicionAnalysis {
  score: number;
  factors: string[];
  riskLevel: 'low' | 'medium' | 'high';
  explanation: string;
}

export interface UrlAnalysis {
  domain: string;
  subdomains: string[];
  tld: string;
  path: string;
  fullUrl: string;
}

// Suspicious TLDs with higher risk scores
const SUSPICIOUS_TLDS = {
  '.tk': 25,    // Tokelau - often used for malicious sites
  '.ml': 25,    // Mali - free domain, often abused
  '.ga': 25,    // Gabon - free domain, often abused  
  '.cf': 25,    // Central African Republic - free domain
  '.ru': 20,    // Russia - higher risk due to geopolitical factors
  '.cn': 15,    // China - higher scrutiny needed
  '.xyz': 15,   // Often used for suspicious activities
  '.top': 15,   // Commonly abused TLD
  '.click': 20, // Often used in malicious campaigns
  '.download': 20, // Often used for malware distribution
  '.loan': 25,  // Often used in scam sites
  '.review': 15, // Often fake review sites
  '.stream': 15, // Often used for illegal streaming
  '.science': 15, // Often used in tech scams
};

// Free hosting platforms that are often abused
const FREE_HOSTING_PLATFORMS = [
  'weebly.com',
  'wix.com', 
  'blogspot.com',
  'wordpress.com',
  'github.io',
  'herokuapp.com',
  'repl.co',
  'glitch.me',
  '000webhostapp.com',
  'netlify.app',
  'vercel.app',
  'surge.sh',
  'firebaseapp.com',
  'web.app',
  'azurewebsites.net'
];

// Phishing-related keywords in URLs
const PHISHING_KEYWORDS = [
  'login', 'signin', 'secure', 'verify', 'account', 'update', 'confirm',
  'suspended', 'locked', 'expired', 'billing', 'payment', 'bank',
  'paypal', 'amazon', 'microsoft', 'google', 'apple', 'facebook',
  'security', 'alert', 'warning', 'urgent', 'immediate', 'action',
  'required', 'click', 'now', 'limited', 'offer', 'free', 'winner'
];

// Legitimate domain patterns that shouldn't be flagged
const LEGITIMATE_PATTERNS = [
  /^(www\.)?[a-z0-9-]+\.(com|org|net|edu|gov|mil)$/i,
  /^[a-z0-9-]+\.github\.io$/i, // GitHub pages are generally legitimate
];

/**
 * Parse URL into components for analysis
 */
function parseUrl(url: string): UrlAnalysis {
  try {
    // Normalize URL
    let normalizedUrl = url.toLowerCase().trim();
    if (!normalizedUrl.startsWith('http')) {
      normalizedUrl = `http://${normalizedUrl}`;
    }

    const urlObj = new URL(normalizedUrl);
    const hostname = urlObj.hostname;
    const parts = hostname.split('.');
    
    // Get TLD (last part)
    const tld = `.${parts[parts.length - 1]}`;
    
    // Get domain (second to last part + TLD for simple domains)
    const domain = parts.length >= 2 ? `${parts[parts.length - 2]}${tld}` : hostname;
    
    // Get subdomains (everything before the main domain)
    const subdomains = parts.length > 2 ? parts.slice(0, -2) : [];

    return {
      domain,
      subdomains,
      tld,
      path: urlObj.pathname,
      fullUrl: normalizedUrl
    };
  } catch (error) {
    // If URL parsing fails, return basic analysis
    const parts = url.toLowerCase().split('.');
    return {
      domain: url,
      subdomains: [],
      tld: parts.length > 1 ? `.${parts[parts.length - 1]}` : '',
      path: '',
      fullUrl: url
    };
  }
}

/**
 * Check if domain looks randomly generated
 */
function hasRandomPattern(domain: string): boolean {
  // Check for hexadecimal patterns
  const hexPattern = /[0-9a-f]{8,}/i;
  if (hexPattern.test(domain)) return true;

  // Check for random character sequences (more consonants than vowels)
  const consonants = domain.match(/[bcdfghjklmnpqrstvwxyz]/gi) || [];
  const vowels = domain.match(/[aeiou]/gi) || [];
  
  if (consonants.length > vowels.length * 3 && domain.length > 8) {
    return true;
  }

  // Check for repeated patterns
  const repeatedPattern = /(.{2,})\1{2,}/;
  if (repeatedPattern.test(domain)) return true;

  return false;
}

/**
 * Check if URL contains phishing keywords
 */
function containsPhishingKeywords(url: string): string[] {
  const foundKeywords: string[] = [];
  const lowerUrl = url.toLowerCase();
  
  PHISHING_KEYWORDS.forEach(keyword => {
    if (lowerUrl.includes(keyword)) {
      foundKeywords.push(keyword);
    }
  });
  
  return foundKeywords;
}

/**
 * Check if domain uses free hosting platform
 */
function usesFreeHosting(domain: string): string | null {
  const lowerDomain = domain.toLowerCase();
  
  for (const platform of FREE_HOSTING_PLATFORMS) {
    if (lowerDomain.includes(platform)) {
      return platform;
    }
  }
  
  return null;
}

/**
 * Main function to calculate suspicion score
 */
export function getSuspicionScore(url: string): SuspicionAnalysis {
  const analysis = parseUrl(url);
  let score = 0;
  const factors: string[] = [];

  // Check for suspicious TLD
  const tldScore = SUSPICIOUS_TLDS[analysis.tld] || 0;
  if (tldScore > 0) {
    score += tldScore;
    factors.push(`Suspicious TLD (${analysis.tld}): +${tldScore} points`);
  }

  // Check subdomain count
  if (analysis.subdomains.length > 3) {
    const subdomainScore = Math.min(analysis.subdomains.length * 5, 25);
    score += subdomainScore;
    factors.push(`Too many subdomains (${analysis.subdomains.length}): +${subdomainScore} points`);
  }

  // Check for random patterns in domain
  if (hasRandomPattern(analysis.domain)) {
    score += 20;
    factors.push('Random-looking domain pattern: +20 points');
  }

  // Check for random patterns in subdomains
  analysis.subdomains.forEach(subdomain => {
    if (hasRandomPattern(subdomain)) {
      score += 15;
      factors.push(`Random-looking subdomain (${subdomain}): +15 points`);
    }
  });

  // Check for phishing keywords
  const phishingKeywords = containsPhishingKeywords(url);
  if (phishingKeywords.length > 0) {
    const keywordScore = Math.min(phishingKeywords.length * 10, 30);
    score += keywordScore;
    factors.push(`Phishing keywords (${phishingKeywords.join(', ')}): +${keywordScore} points`);
  }

  // Check for free hosting
  const freeHosting = usesFreeHosting(analysis.domain);
  if (freeHosting) {
    score += 15;
    factors.push(`Free hosting platform (${freeHosting}): +15 points`);
  }

  // Check for URL shorteners (additional risk)
  const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'short.link', 'tiny.cc'];
  if (shorteners.some(shortener => analysis.domain.includes(shortener))) {
    score += 10;
    factors.push('URL shortener detected: +10 points');
  }

  // Check for IP address instead of domain
  const ipPattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  if (ipPattern.test(analysis.domain.replace(/[^\d.]/g, ''))) {
    score += 25;
    factors.push('IP address instead of domain: +25 points');
  }

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high';
  let explanation: string;

  if (score >= 50) {
    riskLevel = 'high';
    explanation = 'This URL has multiple suspicious characteristics and should be treated with extreme caution. Consider avoiding this link entirely.';
  } else if (score >= 25) {
    riskLevel = 'medium';
    explanation = 'This URL shows some suspicious patterns. Proceed with caution and verify the source before clicking.';
  } else {
    riskLevel = 'low';
    explanation = score > 0 
      ? 'This URL has minor suspicious elements but appears relatively safe. Still exercise normal web browsing caution.'
      : 'This URL shows no obvious suspicious patterns based on our heuristic analysis.';
  }

  return {
    score: Math.min(score, 100), // Cap at 100
    factors,
    riskLevel,
    explanation
  };
}

/**
 * Helper function to determine if URL should be flagged as suspicious
 */
export function isSuspicious(score: number): boolean {
  return score >= 25; // Threshold for flagging as suspicious
}

/**
 * Combine heuristic analysis with external API results
 */
export function combineAnalysis(apiResult: any, heuristicAnalysis: SuspicionAnalysis) {
  const combinedScore = Math.max(apiResult.riskScore || 0, heuristicAnalysis.score);
  const isApiUnsafe = !apiResult.isSafe || apiResult.riskScore >= 50;
  const isHeuristicUnsafe = isSuspicious(heuristicAnalysis.score);
  
  return {
    ...apiResult,
    riskScore: combinedScore,
    isSafe: !isApiUnsafe && !isHeuristicUnsafe,
    heuristicAnalysis,
    combinedThreatDetails: formatCombinedThreatDetails(apiResult, heuristicAnalysis)
  };
}

/**
 * Format combined threat details for display
 */
function formatCombinedThreatDetails(apiResult: any, heuristicAnalysis: SuspicionAnalysis): string {
  let details = [];
  
  // Add safety assessment
  const isCombinedSafe = apiResult.isSafe && heuristicAnalysis.riskLevel === 'low';
  const safetyStatus = isCombinedSafe
    ? '✅ This link appears safe based on both external verification and our internal analysis.'
    : '⚠️ This link has been flagged as potentially unsafe by our security analysis.';
  
  details.push(safetyStatus);
  details.push(''); // Empty line for spacing
  
  // External API results
  details.push('🔍 External Security Analysis:');
  if (apiResult.riskScore !== undefined) {
    details.push(`   • Risk Score: ${apiResult.riskScore}/100`);
  }
  if (apiResult.phishing !== undefined) {
    details.push(`   • Phishing: ${apiResult.phishing === true ? 'Yes' : apiResult.phishing === false ? 'No' : apiResult.phishing}`);
  }
  if (apiResult.suspicious !== undefined) {
    details.push(`   • Suspicious Activity: ${apiResult.suspicious === true ? 'Yes' : apiResult.suspicious === false ? 'No' : apiResult.suspicious}`);
  }
  
  // Heuristic analysis
  details.push('');
  details.push('🧠 Our Internal Analysis:');
  details.push(`   • Suspicion Score: ${heuristicAnalysis.score}/100`);
  details.push(`   • Risk Level: ${heuristicAnalysis.riskLevel.toUpperCase()}`);
  
  if (heuristicAnalysis.factors.length > 0) {
    details.push('   • Suspicious Factors Found:');
    heuristicAnalysis.factors.forEach(factor => {
      details.push(`     - ${factor}`);
    });
  }
  
  details.push('');
  details.push('💡 Recommendation:');
  details.push(heuristicAnalysis.explanation);
  
  return details.join('\n');
}
