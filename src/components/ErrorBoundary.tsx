/**
 * ErrorBoundary Component
 *
 * Functional wrapper around react-error-boundary for catching React errors
 * and displaying fallback UI. Implements React 19 error handling best practices.
 */

import type { ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  /** Child components to render */
  children: ReactNode;

  /** Optional fallback UI (receives error and reset function) */
  fallback?: (error: Error, resetErrorBoundary: () => void) => ReactNode;

  /** Optional callback when error is caught */
  onError?: (
    error: Error,
    errorInfo: { componentStack?: string | null }
  ) => void;
}

/**
 * Default fallback UI component
 */
function DefaultFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Oops! Something went wrong
          </h1>
          <p className="text-muted-foreground">
            We encountered an unexpected error. Don't worry, your game progress
            is saved.
          </p>
        </div>

        {/* Show error details in development */}
        {import.meta.env.DEV && (
          <details className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-left">
            <summary className="cursor-pointer font-semibold text-destructive">
              Error Details (dev only)
            </summary>
            <pre className="mt-2 overflow-x-auto text-xs text-destructive">
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          </details>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={resetErrorBoundary} size="lg">
            Try Again
          </Button>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="lg"
          >
            Reload Page
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * ErrorBoundary component (functional wrapper)
 *
 * Catches errors in child components and displays a fallback UI.
 * Provides a reset function to attempt recovery.
 *
 * @example
 * <ErrorBoundary>
 *   <GameShell store={store} />
 * </ErrorBoundary>
 *
 * @example
 * <ErrorBoundary
 *   fallback={(error, reset) => (
 *     <CustomErrorUI error={error} onReset={reset} />
 *   )}
 *   onError={(error) => logError(error)}
 * >
 *   <GameShell store={store} />
 * </ErrorBoundary>
 */
export function ErrorBoundary({
  children,
  fallback,
  onError,
}: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => {
        // Use custom fallback if provided
        if (fallback) {
          return fallback(error, resetErrorBoundary);
        }
        // Use default fallback
        return (
          <DefaultFallback
            error={error}
            resetErrorBoundary={resetErrorBoundary}
          />
        );
      }}
      onError={(error, errorInfo) => {
        // Log error to console in development
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        // Call optional error handler
        onError?.(error, errorInfo);
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
