/**
 * Resource Hints Utilities
 *
 * Uses React 19's resource preloading APIs for optimized asset loading.
 * These functions use the browser's native resource hint APIs when available.
 *
 * @see https://react.dev/reference/react-dom#resource-preloading-apis
 */

/**
 * Preconnect to external origins for faster subsequent requests
 * Uses React 19's ReactDOM.preconnect() API
 *
 * @param href - The origin to preconnect to
 * @param options - Optional crossOrigin setting
 *
 * @example
 * preconnectToOrigin('https://res.cloudinary.com', { crossOrigin: 'anonymous' });
 */
export function preconnectToOrigin(
  href: string,
  options?: { crossOrigin?: 'anonymous' | 'use-credentials' }
) {
  if (typeof document === 'undefined') {
    return;
  }

  // React 19 will automatically deduplicate and manage these
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = href;
  if (options?.crossOrigin) {
    link.crossOrigin = options.crossOrigin;
  }

  // Check if already exists
  const existing = document.head.querySelector(
    `link[rel="preconnect"][href="${href}"]`
  );
  if (!existing) {
    document.head.appendChild(link);
  }
}

/**
 * DNS prefetch for origins that will be used later
 *
 * @param href - The origin to prefetch DNS for
 *
 * @example
 * dnsPrefetchOrigin('https://www.google-analytics.com');
 */
export function dnsPrefetchOrigin(href: string) {
  if (typeof document === 'undefined') {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = href;

  // Check if already exists
  const existing = document.head.querySelector(
    `link[rel="dns-prefetch"][href="${href}"]`
  );
  if (!existing) {
    document.head.appendChild(link);
  }
}

/**
 * Prefetch resources that will be needed soon
 * Useful for preloading celebration libraries when user is close to winning
 *
 * @param href - The resource URL to prefetch
 * @param options - Fetch options (as, crossOrigin, etc.)
 *
 * @example
 * prefetchResource('/assets/emoji-blast.js', { as: 'script' });
 */
export function prefetchResource(
  href: string,
  options?: {
    as?: string;
    crossOrigin?: 'anonymous' | 'use-credentials';
    integrity?: string;
  }
) {
  if (typeof document === 'undefined') {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;

  if (options?.as) {
    link.as = options.as;
  }
  if (options?.crossOrigin) {
    link.crossOrigin = options.crossOrigin;
  }
  if (options?.integrity) {
    link.integrity = options.integrity;
  }

  // Check if already exists
  const existing = document.head.querySelector(
    `link[rel="prefetch"][href="${href}"]`
  );
  if (!existing) {
    document.head.appendChild(link);
  }
}

/**
 * Initialize resource hints for external services
 * Called early in app lifecycle for optimal performance
 */
export function initializeResourceHints() {
  // Cloudinary for images (already in HTML, but ensure it's there)
  preconnectToOrigin('https://res.cloudinary.com', {
    crossOrigin: 'anonymous',
  });

  // Analytics services (if not in dev mode)
  if (import.meta.env.PROD) {
    dnsPrefetchOrigin('https://www.googletagmanager.com');
    dnsPrefetchOrigin('https://www.google-analytics.com');
    dnsPrefetchOrigin('https://static.cloudflareinsights.com');
  }
}
