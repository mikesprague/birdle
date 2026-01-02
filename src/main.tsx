/**
 * Application Entry Point
 *
 * Initializes the application, registers service worker for PWA,
 * sets up analytics (production only), and renders the React app.
 */

import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { registerServiceWorker } from '@/pwa/registerServiceWorker';
import { initAnalytics } from '@/utils/analytics';
import { initializeResourceHints } from '@/utils/resource-hints';
import App from './App.tsx';
import './index.css';

// Initialize resource hints for faster external resource loading
initializeResourceHints();

// Register service worker for PWA functionality
registerServiceWorker();

// Initialize analytics (production only)
initAnalytics();

// Get root element
const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Missing #root element - check index.html');
}

// Render app with React 19 error reporting options
createRoot(rootEl, {
  // Called when React catches an error in an Error Boundary
  onCaughtError: (error, errorInfo) => {
    console.error('Caught error:', error, errorInfo);
    // In production, send to error tracking service
    // trackError(error, errorInfo);
  },

  // Called when an error is thrown and not caught by an Error Boundary
  onUncaughtError: (error, errorInfo) => {
    console.error('Uncaught error:', error, errorInfo);
    // In production, send to error tracking service
    // trackError(error, errorInfo, { severity: 'critical' });
  },

  // Called when an error is thrown and automatically recovered
  onRecoverableError: (error, errorInfo) => {
    console.error('Recoverable error:', error, errorInfo);
    // In production, you may want to track these for monitoring
    // trackError(error, errorInfo, { severity: 'warning' });
  },
}).render(
  <StrictMode>
    <Suspense
      fallback={
        <div
          className="flex items-center justify-center min-h-screen"
          style={{
            backgroundColor: 'var(--color-background, #0a0a0a)',
            color: 'var(--color-foreground, #fafafa)',
          }}
        >
          <div className="text-center">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              style={{
                borderColor: 'currentColor',
                borderRightColor: 'transparent',
              }}
            />
            <p className="mt-4 text-lg">Loading Birdle...</p>
          </div>
        </div>
      }
    >
      <App />
    </Suspense>
  </StrictMode>
);
