import { ScanResult } from "../components/ScanResults";
import { supabase } from "@/integrations/supabase/client";

export const checkLink = async (input: string): Promise<ScanResult> => {
  try {
    // Start animation for at least 2 seconds
    const startTime = Date.now();
    
    // Get current user if logged in
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    
    console.log("Calling Supabase Edge Function to check link:", input);
    
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
    
    // Transform the response to our ScanResult format with detailed information
    const scanResult: ScanResult = {
      url: input,
      isSafe: data.isSafe || false,
      type: input.includes('@') ? 'email' : 'link',
      threatDetails: formatThreatDetails(data),
      warningLevel: data.warningLevel || (data.isSafe ? 'safe' : 'danger'),
      timestamp: new Date(),
      riskScore: data.riskScore,
      phishing: data.phishing,
      suspicious: data.suspicious,
      spamming: data.spamming,
      domainAge: data.domainAge,
      country: data.country,
    };
    
    // Ensure animation plays for at least 2 seconds
    await ensureMinimumAnimationTime(startTime);
    
    return scanResult;
  } catch (error) {
    console.error("Link checker error:", error);
    
    // Fall back to a basic result when all else fails
    return {
      url: input,
      isSafe: false,
      type: input.includes('@') ? 'email' : 'link',
      threatDetails: `An error occurred while checking this link. Please try again or verify the link manually.`,
      warningLevel: 'warning',
      timestamp: new Date(),
    };
  }
};

// Format detailed threat information
function formatThreatDetails(data: any): string {
  if (data.isSafe) {
    return '✅ This link appears to be safe based on our security analysis.';
  }
  
  let details = [];
  
  // Add risk score if available
  if (data.riskScore !== undefined && data.riskScore !== null) {
    details.push(`🛡️ Risk Score: ${data.riskScore}`);
  }
  
  // Add phishing status
  if (data.phishing !== undefined && data.phishing !== null) {
    const phishingValue = data.phishing === true ? 'Yes' : data.phishing === false ? 'No' : data.phishing;
    details.push(`⚠️ Phishing: ${phishingValue}`);
  }
  
  // Add suspicious status
  if (data.suspicious !== undefined && data.suspicious !== null) {
    const suspiciousValue = data.suspicious === true ? 'Yes' : data.suspicious === false ? 'No' : data.suspicious;
    details.push(`🚨 Suspicious: ${suspiciousValue}`);
  }
  
  // Add spamming status
  if (data.spamming !== undefined && data.spamming !== null) {
    const spammingValue = data.spamming === true ? 'Yes' : data.spamming === false ? 'No' : data.spamming;
    details.push(`📬 Spamming: ${spammingValue}`);
  }
  
  // Add domain age
  if (data.domainAge) {
    details.push(`📅 Domain Age: ${data.domainAge}`);
  }
  
  // Add country
  if (data.country) {
    details.push(`🌐 Country: ${data.country}`);
  }
  
  return details.length > 0 ? details.join('\n') : '⚠️ This link has been flagged as potentially unsafe.';
}

// Ensure the animation displays for at least 2 seconds for UX purposes
async function ensureMinimumAnimationTime(startTime: number): Promise<void> {
  const elapsedTime = Date.now() - startTime;
  const remainingTime = Math.max(0, 2000 - elapsedTime);
  
  if (remainingTime > 0) {
    await new Promise(resolve => setTimeout(resolve, remainingTime));
  }
}
