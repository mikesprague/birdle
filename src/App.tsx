/**
 * App Component
 *
 * Root application component that initializes the TinyBase store,
 * sets up persistence, runs migrations, and renders the game.
 */

import { useEffect, useState } from 'react';
import { Provider } from 'tinybase/ui-react';
import { GameShell } from '@/components/GameShell';
import { Toaster } from '@/components/Toaster';
import { migrateFromLocalStorage } from '@/store/migration';
import { createGamePersister } from '@/store/persister';
import { createGameStore } from '@/store/store';
import './App.css';

function App() {
  // Create store instance (only once)
  const [store] = useState(() => createGameStore());
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize store with persistence and migration
  useEffect(() => {
    const initStore = async () => {
      try {
        // Setup IndexedDB persister
        await createGamePersister(store);

        // Run localStorage migration (if needed)
        const migrationResult = await migrateFromLocalStorage(store);
        if (migrationResult.migrated) {
          console.log('Successfully migrated legacy data to TinyBase');
        }

        // Mark as ready
        setIsReady(true);
      } catch (err) {
        console.error('Failed to initialize store:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to initialize game'
        );
        // Still mark as ready to allow game to work without persistence
        setIsReady(true);
      }
    };

    initStore();
  }, [store]);

  // Loading state
  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-lg">Loading Birdle...</p>
        </div>
      </div>
    );
  }

  // Error state (still render game, just show warning)
  if (error) {
    console.warn('App initialization warning:', error);
  }

  return (
    <Provider store={store}>
      <div className="app min-h-screen bg-background text-foreground">
        <GameShell store={store} />
        <Toaster store={store} />
      </div>
    </Provider>
  );
}

export default App;
