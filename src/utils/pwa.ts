
// Check if the browser supports PWA features
export const isPWASupported = (): boolean => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

// Register service worker
export const registerServiceWorker = async (): Promise<void> => {
  if (!isPWASupported()) {
    console.log('PWA features not supported in this browser');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });
    
    console.log('Service Worker registered successfully:', registration);
    
    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('New service worker available');
            showUpdateNotification();
          }
        });
      }
    });
    
  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
};

// Show update notification
const showUpdateNotification = (): void => {
  if (confirm('A new version of Link Guardian is available. Would you like to reload?')) {
    window.location.reload();
  }
};

// Check if app is running as PWA - improved detection for Windows
export const isPWAInstalled = (): boolean => {
  // Check for standalone mode
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  
  // Check for iOS standalone
  const isIOSStandalone = (window.navigator as any).standalone === true;
  
  // Check for Android app
  const isAndroidApp = document.referrer.includes('android-app://');
  
  // Check for Windows PWA (additional detection)
  const isWindowsPWA = window.matchMedia('(display-mode: minimal-ui)').matches;
  
  return isStandalone || isIOSStandalone || isAndroidApp || isWindowsPWA;
};

// Install prompt handling - improved for Windows browsers
let deferredPrompt: any = null;

export const setupInstallPrompt = (): void => {
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('Install prompt available - browser supports PWA installation');
    e.preventDefault();
    deferredPrompt = e;
    
    // Dispatch custom event to notify components
    window.dispatchEvent(new CustomEvent('pwa-install-available'));
  });
  
  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed successfully');
    deferredPrompt = null;
    
    // Dispatch custom event to notify components
    window.dispatchEvent(new CustomEvent('pwa-installed'));
  });
};

// Trigger install prompt - enhanced for better Windows support
export const showInstallDialog = async (): Promise<void> => {
  if (!deferredPrompt) {
    throw new Error('Install prompt not available');
  }
  
  try {
    console.log('Showing install prompt...');
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User ${outcome} the install prompt`);
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    deferredPrompt = null;
  } catch (error) {
    console.error('Error showing install prompt:', error);
    throw error;
  }
};

// Network status detection
export const setupNetworkDetection = (): void => {
  const updateNetworkStatus = () => {
    const isOnline = navigator.onLine;
    document.body.classList.toggle('offline', !isOnline);
    
    if (!isOnline) {
      console.log('App is offline - cached content will be served');
    } else {
      console.log('App is online');
    }
  };
  
  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
  updateNetworkStatus();
};
