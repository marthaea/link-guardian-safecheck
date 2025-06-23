
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { showInstallDialog, isPWAInstalled } from '@/utils/pwa';

const InstallButton = () => {
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installPromptAvailable, setInstallPromptAvailable] = useState(false);

  useEffect(() => {
    // Check if PWA is already installed
    setIsInstalled(isPWAInstalled());
    
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('Install prompt available');
      e.preventDefault();
      setInstallPromptAvailable(true);
      setShowInstallButton(true);
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setShowInstallButton(false);
      setIsInstalled(true);
      setInstallPromptAvailable(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Force show install button if not installed and browser supports PWA
    const shouldShowButton = !isPWAInstalled() && 
                            'serviceWorker' in navigator && 
                            (window.location.protocol === 'https:' || window.location.hostname === 'localhost');
    
    if (shouldShowButton) {
      setShowInstallButton(true);
      console.log('Install button shown - PWA features supported');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const getBrowserInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
      return 'Chrome: Click the menu (⋮) → "Install Link Guardian"';
    } else if (userAgent.includes('edg')) {
      return 'Edge: Click the menu (⋯) → "Apps" → "Install this site as an app"';
    } else if (userAgent.includes('firefox')) {
      return 'Firefox: Click the menu (☰) → "Install" or look for the install icon in the address bar';
    } else if (userAgent.includes('safari')) {
      return 'Safari: Click Share → "Add to Home Screen"';
    } else {
      return 'Look for an install option in your browser menu or address bar';
    }
  };

  const handleInstallClick = async () => {
    try {
      if (installPromptAvailable) {
        await showInstallDialog();
      } else {
        // Show manual installation instructions
        const instructions = getBrowserInstructions();
        const message = `To install Link Guardian as an app:\n\n${instructions}\n\nOr look for an install icon (⬇️) in your browser's address bar.`;
        alert(message);
      }
    } catch (error) {
      console.log('Install prompt not available, showing manual instructions');
      const instructions = getBrowserInstructions();
      const message = `To install Link Guardian as an app:\n\n${instructions}\n\nOr look for an install icon (⬇️) in your browser's address bar.`;
      alert(message);
    }
  };

  // Always show button if not installed (except on iOS Safari where PWA install is different)
  const shouldShow = !isInstalled && showInstallButton;

  if (!shouldShow) {
    return null;
  }

  return (
    <Button
      onClick={handleInstallClick}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 text-cyan-400 border-cyan-400 hover:bg-cyan-400 hover:text-gray-900 transition-all duration-200"
      id="pwa-install-button"
    >
      <Download size={16} />
      Install App
    </Button>
  );
};

export default InstallButton;
