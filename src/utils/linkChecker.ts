
import { ScanResult } from "../components/ScanResults";
import { supabase } from "@/integrations/supabase/client";

// Supabase project URL for the edge function
const SUPABASE_PROJECT_URL = "https://ulbsrnosehxzsysuyzsp.supabase.co";

export const checkLink = async (input: string): Promise<ScanResult> => {
  try {
    // Start animation for at least 2 seconds
    const startTime = Date.now();
    
    // Get current user if logged in
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    
    console.log("Calling edge function to check link:", input);
    
    // Call the edge function to check the link
    const response = await fetch(`${SUPABASE_PROJECT_URL}/functions/v1/check-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await supabase.auth.getSession().then(res => res.data.session?.access_token || '')}`,
      },
      body: JSON.stringify({ input, userId }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}):`, errorText);
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }
    
    const scanResult = await response.json();
    console.log("Scan result:", scanResult);
    
    // Ensure animation plays for at least 2 seconds
    await ensureMinimumAnimationTime(startTime);
    
    return {
      ...scanResult,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Link checker error:", error);
    return {
      url: input,
      isSafe: false,
      type: input.includes('@') ? 'email' : 'link',
      threatDetails: `An error occurred while checking this link: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
