
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
    const installed = isPWAInstalled();
    setIsInstalled(installed);
    
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

    // Listen for custom PWA events
    const handlePWAInstallAvailable = () => {
      console.log('PWA install available event received');
      setInstallPromptAvailable(true);
      setShowInstallButton(true);
    };

    const handlePWAInstalled = () => {
      console.log('PWA installed event received');
      setShowInstallButton(false);
      setIsInstalled(true);
      setInstallPromptAvailable(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('pwa-install-available', handlePWAInstallAvailable);
    window.addEventListener('pwa-installed', handlePWAInstalled);

    // Show install button if PWA features are supported and not installed
    const shouldShowButton = !installed && 
                            'serviceWorker' in navigator && 
                            (window.location.protocol === 'https:' || window.location.hostname === 'localhost');
    
    if (shouldShowButton) {
      setShowInstallButton(true);
      console.log('Install button shown - PWA features supported');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('pwa-install-available', handlePWAInstallAvailable);
      window.removeEventListener('pwa-installed', handlePWAInstalled);
    };
  }, []);

  const getBrowserInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
      return 'Chrome: Look for the install icon (⬇️) in the address bar or click the menu (⋮) → "Install Link Guardian"';
    } else if (userAgent.includes('edg')) {
      return 'Edge: Look for the install icon (⬇️) in the address bar or click the menu (⋯) → "Apps" → "Install this site as an app"';
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
        const message = `To install Link Guardian as an app:\n\n${instructions}\n\nThis app meets PWA standards and should be installable in your browser.`;
        alert(message);
      }
    } catch (error) {
      console.log('Install prompt not available, showing manual instructions');
      const instructions = getBrowserInstructions();
      const message = `To install Link Guardian as an app:\n\n${instructions}\n\nThis app meets PWA standards and should be installable in your browser.`;
      alert(message);
    }
  };

  // Show button if not installed and PWA features are supported
  if (isInstalled) {
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
