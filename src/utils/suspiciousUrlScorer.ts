export const getSuspicionScore = (url: string) => {
  let score = 0;
  let factors: string[] = [];
  
  // Check for common URL shortening services
  if (/(bit\.ly|goo\.gl|t\.co|tinyurl|ow\.ly|is\.gd|buff\.ly|adf\.ly|ity\.im)/i.test(url)) {
    score += 20;
    factors.push('URL shortening service used');
  }
  
  // Check for IP address instead of domain
  if (/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(url)) {
    score += 30;
    factors.push('IP address used instead of domain');
  }
  
  // Check for unusual domain extensions
  if (/\.(top|tk|xyz|bid|loan|win|club|site|date)/i.test(url)) {
    score += 15;
    factors.push('Unusual domain extension');
  }
  
  // Check for multiple redirects
  // This is difficult to implement on the client-side without making actual HTTP requests,
  // which could be slow and potentially risky. It's better to handle this server-side.
  
  // Check for HTTPS mismatch (if the site redirects from HTTPS to HTTP)
  if (url.startsWith('https://') && url.replace(/^https:\/\//i, '').startsWith('http://')) {
    score += 25;
    factors.push('HTTPS to HTTP redirect');
  }
  
  // Check for suspicious characters in the URL
  if (/[<>"{}`|\\^~[\]';]/i.test(url)) {
    score += 10;
    factors.push('Suspicious characters in URL');
  }
  
  // Check for long URLs
  if (url.length > 200) {
    score += 10;
    factors.push('Long URL');
  }
  
  // Check for numbers in domain
  if (/[0-9]/i.test(url)) {
    score += 5;
    factors.push('Numbers in domain');
  }
  
  // Normalize the score between 0 and 100
  score = Math.max(0, Math.min(100, score));
  
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (score >= 60) {
    riskLevel = 'high';
  } else if (score >= 30) {
    riskLevel = 'medium';
  }
  
  let explanation = '';
  if (riskLevel === 'high') {
    explanation = 'This link has several characteristics commonly associated with malicious content. Exercise extreme caution.';
  } else if (riskLevel === 'medium') {
    explanation = 'This link has some suspicious characteristics. Be cautious and verify the source before proceeding.';
  } else {
    explanation = 'This link appears to be safe, but always exercise caution when visiting unfamiliar websites.';
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
  
  // API Analysis Section
  threatDetails.push('🛡️ External Security Analysis:');
  if (apiData.phishing) {
    threatDetails.push('   ⚠️ PHISHING: This site has been flagged for phishing activities');
  }
  if (apiData.suspicious) {
    threatDetails.push('   ⚠️ SUSPICIOUS: This site exhibits suspicious behavior patterns');
  }
  if (apiData.spamming) {
    threatDetails.push('   ⚠️ SPAM: This site has been associated with spam activities');
  }
  if (apiData.domainAge) {
    threatDetails.push(`   📅 Domain Age: ${apiData.domainAge}`);
  }
  if (apiData.country) {
    threatDetails.push(`   🌍 Country: ${apiData.country}`);
  }
  if (!apiData.phishing && !apiData.suspicious && !apiData.spamming) {
    threatDetails.push('   ✅ No external threats detected');
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
