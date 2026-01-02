/**
 * App Component
 *
 * Root application component that initializes the TinyBase store,
 * sets up persistence, runs migrations, and renders the game.
 * Uses React 19 use() API for async initialization.
 */

import { use } from 'react';
import { Provider } from 'tinybase/ui-react';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { GameShell } from '@/components/GameShell';
import { Toaster } from '@/components/Toaster';

import { migrateFromLocalStorage } from '@/store/migration';
import { createGamePersister } from '@/store/persister';
import { createGameStore } from '@/store/store';
import { gameLogger } from '@/utils/logger';

/**
 * Initialize store with async operations
 * Used with React 19 use() API
 * Created once at module level to prevent re-creation on renders
 */
async function initializeStore() {
  const store = createGameStore();

  try {
    // Setup IndexedDB persister
    await createGamePersister(store);
    gameLogger.info('Store persister initialized');

    // Run localStorage migration (if needed)
    const migrationResult = await migrateFromLocalStorage(store);
    if (migrationResult.migrated) {
      gameLogger.info('Successfully migrated legacy data to TinyBase');
    }

    return store;
  } catch (err) {
    gameLogger.error('Failed to initialize store', { error: err });
    // Return store anyway to allow game to work without persistence
    return store;
  }
}

// Create promise at module level (only once)
const storePromise = initializeStore();

function App() {
  // Use React 19 use() API to suspend on async initialization
  const store = use(storePromise);

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log to console for debugging
        gameLogger.error('App Error', { error, errorInfo });
        // In production, you could send to error tracking service
        // trackError(error, errorInfo);
      }}
    >
      <Provider store={store}>
        <div className="app h-dvh bg-background text-foreground overflow-hidden">
          <GameShell store={store} />
          <Toaster store={store} />
        </div>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
