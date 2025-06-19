
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
    
    // Transform the response to our ScanResult format
    const scanResult: ScanResult = {
      url: input,
      isSafe: data.isSafe || false,
      type: input.includes('@') ? 'email' : 'link',
      threatDetails: data.threatDetails || 'Link analysis completed',
      warningLevel: data.warningLevel || (data.isSafe ? 'safe' : 'danger'),
      timestamp: new Date(),
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

// Ensure the animation displays for at least 2 seconds for UX purposes
async function ensureMinimumAnimationTime(startTime: number): Promise<void> {
  const elapsedTime = Date.now() - startTime;
  const remainingTime = Math.max(0, 2000 - elapsedTime);
  
  if (remainingTime > 0) {
    await new Promise(resolve => setTimeout(resolve, remainingTime));
  }
}
