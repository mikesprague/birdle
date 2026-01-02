/**
 * Application Entry Point
 *
 * Initializes the application, registers service worker for PWA,
 * sets up analytics (production only), and renders the React app.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerServiceWorker } from '@/pwa/registerServiceWorker';
import { initAnalytics } from '@/utils/analytics';
import App from './App.tsx';
import './index.css';

// Register service worker for PWA functionality
registerServiceWorker();

// Initialize analytics (production only)
initAnalytics();

// Get root element
const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Missing #root element - check index.html');
}

// Render app
createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>
);
