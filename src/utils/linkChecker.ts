
import { ScanResult } from "../components/ScanResults";

// In a real application, this would connect to actual security APIs
// For demo purposes, we'll simulate security checks based on patterns

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

export const checkLink = async (input: string): Promise<ScanResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
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
  const hasSuspiciousPatterns = suspiciousPatterns.some(pattern => input.toLowerCase().includes(pattern));
  
  // Special case for demo purposes - make 'example.com' always safe
  if (domain.includes('example.com')) {
    return {
      url: input,
      isSafe: true,
      type,
      timestamp: new Date(),
    };
  }
  
  // For demo purposes, randomly determine safety for other domains
  // In a real app, this would use actual security APIs
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
};
