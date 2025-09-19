export const getSuspicionScore = (url: string) => {
  let score = 0;
  let factors: string[] = [];
  
  // Normalize URL for analysis
  const normalizedUrl = url.toLowerCase();
  
  // Check for common URL shortening services (High Risk)
  if (/(bit\.ly|goo\.gl|t\.co|tinyurl|ow\.ly|is\.gd|buff\.ly|adf\.ly|ity\.im|short\.link|rebrand\.ly)/i.test(url)) {
    score += 25;
    factors.push('URL shortening service detected');
  }
  
  // Check for IP address instead of domain (Very High Risk)
  if (/^https?:\/\/(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/.test(url)) {
    score += 35;
    factors.push('IP address used instead of domain name');
  }
  
  // Check for suspicious domain extensions (Medium Risk)
  if (/\.(tk|ml|ga|cf|top|xyz|bid|loan|win|club|site|date|click|download|info|biz|work|review|country|stream|gq)/i.test(url)) {
    score += 20;
    factors.push('Suspicious domain extension');
  }
  
  // Check for URL with excessive subdomains (Medium Risk)
  const domainParts = url.replace(/^https?:\/\//, '').split('/')[0].split('.');
  if (domainParts.length > 4) {
    score += 15;
    factors.push('Excessive subdomains detected');
  }
  
  // Check for suspicious characters in URL (Low-Medium Risk)
  if (/[<>"{}`|\\^~[\]';%]/i.test(url)) {
    score += 12;
    factors.push('Suspicious characters in URL');
  }
  
  // Check for very long URLs (Low Risk)
  if (url.length > 200) {
    score += 8;
    factors.push('Unusually long URL');
  } else if (url.length > 100) {
    score += 4;
    factors.push('Long URL detected');
  }
  
  // Check for excessive numbers in domain (Low Risk)
  const domainSection = url.replace(/^https?:\/\//, '').split('/')[0];
  const numberCount = (domainSection.match(/[0-9]/g) || []).length;
  if (numberCount > 3) {
    score += 10;
    factors.push('Multiple numbers in domain');
  } else if (numberCount > 1) {
    score += 5;
    factors.push('Numbers present in domain');
  }
  
  // Check for URL encoded characters (Medium Risk)
  if (/%[0-9a-f]{2}/i.test(url)) {
    score += 15;
    factors.push('URL encoded characters detected');
  }
  
  // Check for suspicious keywords (High Risk)
  const suspiciousKeywords = ['secure', 'update', 'verify', 'confirm', 'account', 'login', 'banking', 'paypal', 'amazon', 'microsoft', 'google', 'apple', 'urgent', 'suspended', 'expired', 'winner', 'prize', 'lottery', 'inheritance', 'tax', 'refund', 'discount', 'offer', 'free', 'gift', 'reward', 'congratulations'];
  const foundKeywords = suspiciousKeywords.filter(keyword => normalizedUrl.includes(keyword));
  if (foundKeywords.length > 0) {
    score += foundKeywords.length * 10;
    factors.push(`Suspicious keywords found: ${foundKeywords.join(', ')}`);
  }
  
  // Check for typosquatting patterns (Very High Risk)
  const popularSites = ['google', 'facebook', 'amazon', 'paypal', 'microsoft', 'apple', 'twitter', 'instagram', 'linkedin', 'netflix', 'spotify', 'github'];
  for (const site of popularSites) {
    const variations = [
      site.replace('o', '0'), // o to 0
      site.replace('l', '1'), // l to 1  
      site.replace('i', '1'), // i to 1
      site + '1', site + '2', // adding numbers
      site.replace('e', '3'), // e to 3
      site.replace('a', '@'), // a to @
    ];
    
    for (const variation of variations) {
      if (normalizedUrl.includes(variation) && !normalizedUrl.includes(site)) {
        score += 40;
        factors.push(`Potential typosquatting of ${site} detected`);
        break;
      }
    }
  }
  
  // Check for suspicious file extensions (High Risk)
  if (/\.(exe|scr|bat|cmd|com|pif|vbs|js|jar|zip|rar)($|\?|#)/i.test(url)) {
    score += 30;
    factors.push('Suspicious file extension detected');
  }
  
  // Check for base64 encoded content (Medium Risk)
  if (/base64|data:/.test(url)) {
    score += 20;
    factors.push('Base64 encoded content detected');
  }
  
  // Check for social engineering indicators (High Risk)
  const socialEngineeringTerms = ['click here', 'act now', 'limited time', 'expires today', 'claim now', 'download now', 'install now'];
  const foundSocialTerms = socialEngineeringTerms.filter(term => normalizedUrl.includes(term.replace(' ', '')));
  if (foundSocialTerms.length > 0) {
    score += 25;
    factors.push('Social engineering patterns detected');
  }
  
  // Check for cryptocurrency/financial scam indicators (Very High Risk)
  const cryptoScamTerms = ['bitcoin', 'crypto', 'invest', 'profit', 'trading', 'forex', 'doubler', 'multiplier'];
  const foundCryptoTerms = cryptoScamTerms.filter(term => normalizedUrl.includes(term));
  if (foundCryptoTerms.length > 0) {
    score += foundCryptoTerms.length * 15;
    factors.push('Potential cryptocurrency/financial scam indicators');
  }
  
  // Check for homograph attacks (look-alike characters)
  if (/[а-я]|[αβγδεζηθικλμνξοπρστυφχψω]|[аеорстих]/i.test(url)) {
    score += 30;
    factors.push('Potentially deceptive characters detected');
  }
  
  // Check for HTTPS vs HTTP mismatch patterns
  if (url.startsWith('http://') && !url.includes('localhost')) {
    score += 10;
    factors.push('Non-secure HTTP protocol used');
  }
  
  // Check for suspicious path patterns
  if (/\/(admin|wp-admin|login|signin|account|banking|secure|update|verify)/i.test(url)) {
    score += 12;
    factors.push('Suspicious path pattern detected');
  }
  
  // Check for multiple redirects indicators
  if (/redirect|forward|goto|link|url=/i.test(url)) {
    score += 18;
    factors.push('Potential redirect mechanism detected');
  }
  
  // Bonus points for well-known safe domains (but be strict about exact matches)
  const safeDomains = ['google.com', 'microsoft.com', 'apple.com', 'amazon.com', 'facebook.com', 'twitter.com', 'linkedin.com', 'github.com', 'stackoverflow.com', 'wikipedia.org', 'youtube.com', 'gmail.com'];
  const domainOnly = domainSection.replace(/^www\./, '');
  const isSafeDomain = safeDomains.includes(domainOnly);
  if (isSafeDomain) {
    score = Math.max(0, score - 25);
    factors.push('Verified safe domain');
  }
  
  // Additional security checks for modern threats
  
  // Check for internationalized domain names (IDN) that might be spoofed
  if (/xn--/.test(url)) {
    score += 20;
    factors.push('Internationalized domain name detected (potential spoofing risk)');
  }
  
  // Check for suspicious port numbers
  if (/:(?!80|443|8080)\d+/.test(url)) {
    score += 15;
    factors.push('Non-standard port number detected');
  }
  
  // Check for data URIs (high risk for XSS)
  if (/^data:/.test(url)) {
    score += 35;
    factors.push('Data URI detected (potential XSS risk)');
  }
  
  // Normalize the score between 0 and 100
  score = Math.max(0, Math.min(100, score));
  
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (score >= 50) { // Lowered threshold for high risk
    riskLevel = 'high';
  } else if (score >= 25) { // Lowered threshold for medium risk
    riskLevel = 'medium';
  }
  
  let explanation = '';
  if (riskLevel === 'high') {
    explanation = 'This link has multiple characteristics commonly associated with malicious content. Exercise extreme caution and avoid clicking.';
  } else if (riskLevel === 'medium') {
    explanation = 'This link has some suspicious characteristics. Be cautious, verify the source, and avoid entering sensitive information.';
  } else {
    explanation = 'This link appears to have low risk based on our analysis, but always exercise caution when visiting unfamiliar websites.';
  }
  
  return {
    score: score,
    riskLevel: riskLevel,
    factors: factors,
    explanation: explanation
  };
};

export const combineAnalysis = (apiData: any, heuristicAnalysis: any) => {
  // Calculate combined risk score (weighted average)
  const apiRiskScore = apiData.riskScore || (apiData.isSafe ? 10 : 80);
  const combinedRiskScore = Math.round((apiRiskScore * 0.7) + (heuristicAnalysis.score * 0.3));
  
  // Determine overall safety - if either system flags as unsafe, mark as unsafe
  const apiUnsafe = !apiData.isSafe || apiData.phishing || apiData.suspicious;
  const heuristicUnsafe = heuristicAnalysis.riskLevel !== 'low';
  const overallSafe = !apiUnsafe && !heuristicUnsafe;
  
  // Determine warning level based on combined analysis
  let warningLevel: 'safe' | 'warning' | 'danger';
  if (overallSafe && combinedRiskScore < 30) {
    warningLevel = 'safe';
  } else if (combinedRiskScore >= 70 || apiData.phishing || heuristicAnalysis.riskLevel === 'high') {
    warningLevel = 'danger';
  } else {
    warningLevel = 'warning';
  }
  
  // Create comprehensive threat details
  let threatDetails = [];
  
  // External Analysis Section 1 - IPQS
  if (apiData.ipqsAnalysis) {
    threatDetails.push('🛡️ IPQS Security Analysis:');
    if (apiData.ipqsAnalysis.risk_score > 70) {
      threatDetails.push('   ⚠️ HIGH RISK: Significant security concerns detected');
    } else if (apiData.ipqsAnalysis.risk_score > 30) {
      threatDetails.push('   ⚠️ MODERATE RISK: Some security concerns detected');
    } else {
      threatDetails.push('   ✅ LOW RISK: Minimal security concerns');
    }
    threatDetails.push(`   • Risk Score: ${apiData.ipqsAnalysis.risk_score}/100`);
    if (apiData.phishing) threatDetails.push('   • Phishing activity detected');
    if (apiData.suspicious) threatDetails.push('   • Suspicious behavior patterns');
    if (apiData.spamming) threatDetails.push('   • Spam activity detected');
  } else {
    threatDetails.push('🛡️ IPQS Security Analysis: Service unavailable');
  }
  
  threatDetails.push('');
  
  // External Analysis Section 2 - VirusTotal
  if (apiData.virusTotalAnalysis) {
    threatDetails.push('🦠 VirusTotal Security Analysis:');
    if (apiData.virusTotalAnalysis.detected) {
      threatDetails.push(`   ⚠️ THREATS DETECTED: ${apiData.virusTotalAnalysis.positives}/${apiData.virusTotalAnalysis.total} security engines flagged this URL`);
    } else {
      threatDetails.push(`   ✅ CLEAN: 0/${apiData.virusTotalAnalysis.total} security engines detected threats`);
    }
    if (apiData.virusTotalAnalysis.scan_date) {
      threatDetails.push(`   • Last scanned: ${new Date(apiData.virusTotalAnalysis.scan_date).toLocaleDateString()}`);
    }
  } else {
    threatDetails.push('🦠 VirusTotal Security Analysis: Service unavailable');
  }
  
  threatDetails.push('');
  
  // Domain Information
  threatDetails.push('🌍 Domain Information:');
  if (apiData.domainAge) {
    threatDetails.push(`   📅 Domain Age: ${apiData.domainAge}`);
  }
  if (apiData.country) {
    threatDetails.push(`   🌍 Country: ${apiData.country}`);
  }
  
  threatDetails.push('');
  
  // Heuristic Analysis Section
  threatDetails.push('🧠 Internal Heuristic Analysis:');
  threatDetails.push(`   • Suspicion Score: ${heuristicAnalysis.score}/100`);
  threatDetails.push(`   • Risk Assessment: ${heuristicAnalysis.riskLevel.toUpperCase()}`);
  
  if (heuristicAnalysis.factors.length > 0) {
    threatDetails.push('   • Suspicious Patterns Detected:');
    heuristicAnalysis.factors.forEach((factor: string) => {
      threatDetails.push(`     - ${factor}`);
    });
  } else {
    threatDetails.push('   • No suspicious patterns detected');
  }
  
  threatDetails.push('');
  
  // Overall Assessment
  threatDetails.push('📊 Combined Security Assessment:');
  threatDetails.push(`   • Overall Risk Score: ${combinedRiskScore}/100`);
  threatDetails.push(`   • Security Status: ${overallSafe ? 'SAFE' : 'POTENTIALLY UNSAFE'}`);
  threatDetails.push('   • Analysis Sources: External APIs + Internal Heuristics');
  threatDetails.push('');
  
  // Recommendation
  threatDetails.push('💡 Recommendation:');
  if (warningLevel === 'safe') {
    threatDetails.push('   This link appears safe to visit based on our comprehensive analysis.');
  } else if (warningLevel === 'warning') {
    threatDetails.push('   Exercise caution when visiting this link. Verify the source and avoid entering sensitive information.');
  } else {
    threatDetails.push('   ⚠️ AVOID this link. Our analysis indicates significant security risks.');
  }
  
  return {
    isSafe: overallSafe,
    riskScore: combinedRiskScore,
    warningLevel,
    combinedThreatDetails: threatDetails.join('\n')
  };
};
