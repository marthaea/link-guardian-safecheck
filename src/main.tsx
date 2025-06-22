
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { 
  registerServiceWorker, 
  setupInstallPrompt, 
  setupNetworkDetection 
} from './utils/pwa.ts'

// Initialize PWA features
const initializePWA = async () => {
  try {
    await registerServiceWorker();
    setupInstallPrompt();
    setupNetworkDetection();
    console.log('PWA features initialized successfully');
  } catch (error) {
    console.error('Failed to initialize PWA features:', error);
  }
};

// Initialize app
const initializeApp = () => {
  const root = createRoot(document.getElementById("root")!);
  root.render(<App />);
  
  // Initialize PWA features after app starts
  initializePWA();
};

// Start the app
initializeApp();
