
import { ScanResult } from "../components/ScanResults";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Updated API URL for link checking
const LINK_CHECK_API_URL = "https://phisher-yeu4.onrender.com/api/check-url";

export const checkLink = async (input: string): Promise<ScanResult> => {
  try {
    // Start animation for at least 2 seconds
    const startTime = Date.now();
    
    // Get current user if logged in
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    
    console.log("Calling API to check link:", input);
    
    // Call the new API to check the link
    const response = await fetch(LINK_CHECK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: input }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}):`, errorText);
      
      // Show toast notification for API errors
      toast({
        title: "API Error",
        description: `Could not check link security. Using simulation instead.`,
        variant: "destructive",
      });
      
      // Fall back to simulation
      throw new Error(`API error: ${response.status}`);
    }
    
    const apiResult = await response.json();
    console.log("API result:", apiResult);
    
    // Transform API response to our ScanResult format
    const scanResult: ScanResult = {
      url: input,
      isSafe: apiResult.safe || false,
      type: input.includes('@') ? 'email' : 'link',
      threatDetails: apiResult.message || 'Link analysis completed',
      warningLevel: apiResult.safe ? 'safe' : 'danger',
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
