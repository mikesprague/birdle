/**
 * Analytics Utility
 *
 * Handles initialization of analytics services (Cloudflare, Google Analytics, etc.)
 * Only runs in production environments.
 */

import { isDev, isLocal } from './game-logic';

/**
 * Initialize analytics services
 *
 * Conditionally loads analytics scripts based on environment.
 * Only runs in production (not dev or local).
 *
 * @example
 * initAnalytics();
 */
export function initAnalytics(): void {
  // Skip analytics in development and local environments
  if (isDev() || isLocal()) {
    console.log('Analytics disabled in development/local mode');
    return;
  }

  try {
    // Initialize Cloudflare Web Analytics
    initCloudflareAnalytics();

    // Initialize Google Analytics (if configured)
    // initGoogleAnalytics();

    console.log('Analytics initialized successfully');
  } catch (error) {
    console.error('Failed to initialize analytics:', error);
  }
}

/**
 * Initialize Cloudflare Web Analytics
 *
 * Loads the Cloudflare beacon script for web analytics.
 * Token should be configured via environment variable.
 */
function initCloudflareAnalytics(): void {
  const token = import.meta.env.VITE_CLOUDFLARE_ANALYTICS_TOKEN;

  if (!token || token === 'YOUR_CLOUDFLARE_TOKEN') {
    console.warn(
      'Cloudflare Analytics token not configured. Set VITE_CLOUDFLARE_ANALYTICS_TOKEN environment variable.'
    );
    return;
  }

  const script = document.createElement('script');
  script.defer = true;
  script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  script.setAttribute('data-cf-beacon', JSON.stringify({ token }));
  script.onerror = () => {
    console.error('Failed to load Cloudflare Analytics script');
  };

  document.head.appendChild(script);
}

/**
 * Initialize Google Analytics
 *
 * Loads Google Analytics (gtag.js) for tracking.
 * Measurement ID should be configured via environment variable.
 *
 * Currently unused - uncomment in initAnalytics() if needed
 */
/* function _initGoogleAnalytics(): void {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId || measurementId === 'YOUR_GA_ID') {
    console.warn(
      'Google Analytics measurement ID not configured. Set VITE_GA_MEASUREMENT_ID environment variable.'
    );
    return;
  }

  // Load gtag.js script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.onerror = () => {
    console.error('Failed to load Google Analytics script');
  };

  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];

  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }

  gtag('js', new Date());
  gtag('config', measurementId);
} */

/**
 * Track a custom event
 *
 * @param eventName - Name of the event to track
 * @param eventParams - Optional parameters for the event
 *
 * @example
 * trackEvent('game_completed', { won: true, attempts: 3 });
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, unknown>
): void {
  if (isDev() || isLocal()) {
    console.log('Analytics event (dev mode):', eventName, eventParams);
    return;
  }

  // Google Analytics event tracking
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
  }

  // Add other analytics providers here as needed
}

/**
 * Track page view
 *
 * @param pagePath - Path of the page to track
 *
 * @example
 * trackPageView('/game');
 */
export function trackPageView(pagePath: string): void {
  if (isDev() || isLocal()) {
    console.log('Analytics page view (dev mode):', pagePath);
    return;
  }

  // Google Analytics page view tracking
  if (typeof window.gtag === 'function') {
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
      page_path: pagePath,
    });
  }
}

/**
 * Type declarations for global analytics objects
 */
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}
