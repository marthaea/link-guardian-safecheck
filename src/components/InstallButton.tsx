
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { showInstallDialog, isPWAInstalled } from '@/utils/pwa';

const InstallButton = () => {
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if PWA is already installed
    setIsInstalled(isPWAInstalled());
    
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('Install prompt available');
      e.preventDefault();
      setShowInstallButton(true);
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setShowInstallButton(false);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Show button if not installed and PWA features are supported
    if (!isPWAInstalled() && 'serviceWorker' in navigator) {
      setShowInstallButton(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    try {
      await showInstallDialog();
    } catch (error) {
      console.log('Install prompt not available or user cancelled');
      // Fallback: Show manual installation instructions
      alert('To install this app:\n\n• Chrome: Click the menu (⋮) → "Install Link Guardian"\n• Safari: Click Share → "Add to Home Screen"\n• Firefox: Click the menu → "Install"');
    }
  };

  if (isInstalled || !showInstallButton) {
    return null;
  }

  return (
    <Button
      onClick={handleInstallClick}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 text-cyan-400 border-cyan-400 hover:bg-cyan-400 hover:text-gray-900"
      id="pwa-install-button"
    >
      <Download size={16} />
      Install App
    </Button>
  );
};

export default InstallButton;
