
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
            // You can show a notification to the user about the update
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

// Check if app is running as PWA
export const isPWAInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
};

// Install prompt handling
let deferredPrompt: any = null;

export const setupInstallPrompt = (): void => {
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('Install prompt available');
    e.preventDefault();
    deferredPrompt = e;
    
    // Show custom install button or notification
    showInstallPrompt();
  });
  
  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    deferredPrompt = null;
    hideInstallPrompt();
  });
};

// Show install prompt to user
const showInstallPrompt = (): void => {
  // You can customize this to show your own install UI
  const installButton = document.getElementById('pwa-install-button');
  if (installButton) {
    installButton.style.display = 'block';
  }
};

// Hide install prompt
const hideInstallPrompt = (): void => {
  const installButton = document.getElementById('pwa-install-button');
  if (installButton) {
    installButton.style.display = 'none';
  }
};

// Trigger install prompt
export const showInstallDialog = async (): Promise<void> => {
  if (!deferredPrompt) {
    console.log('Install prompt not available');
    return;
  }
  
  try {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User ${outcome} the install prompt`);
    deferredPrompt = null;
  } catch (error) {
    console.error('Error showing install prompt:', error);
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
