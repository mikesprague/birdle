/**
 * TinyBase IndexedDB Persister Configuration
 *
 * This module handles the setup and configuration of the IndexedDB persister
 * for automatic persistence of the TinyBase store to browser storage.
 */

import type { Store } from 'tinybase';
import { createIndexedDbPersister } from 'tinybase/persisters/persister-indexed-db';
import { storeLogger } from '@/utils/logger';

/**
 * IndexedDB database name
 * This is the unique identifier for the database in IndexedDB
 */
export const DB_NAME = 'birdle-db';

/**
 * Create and configure an IndexedDB persister for the store
 *
 * The persister automatically syncs the TinyBase store with IndexedDB:
 * - Loads data from IndexedDB on initialization
 * - Saves changes to IndexedDB automatically
 * - Handles offline/online scenarios
 *
 * @param store - TinyBase Store instance to persist
 * @returns Promise resolving to the configured persister
 *
 * @example
 * const store = createGameStore();
 * const persister = await createGamePersister(store);
 * // Store is now automatically persisted to IndexedDB
 */
export async function createGamePersister(store: Store) {
  // Create the IndexedDB persister with our database name
  const persister = createIndexedDbPersister(store, DB_NAME);

  // Start automatic persistence (loads data, then watches for changes)
  await persister.startAutoLoad();
  await persister.startAutoSave();

  // Log persister status
  storeLogger.info('✅ IndexedDB persister initialized');
  storeLogger.debug(`   Database: ${persister.getDbName()}`);
  storeLogger.debug(`   Auto-loading: ${persister.isAutoLoading()}`);
  storeLogger.debug(`   Auto-saving: ${persister.isAutoSaving()}`);

  return persister;
}

/**
 * Create and configure persister with initial content fallback
 *
 * This version uses startAutoPersisting() which combines load and save,
 * and allows providing initial content if the database is empty.
 *
 * @param store - TinyBase Store instance to persist
 * @returns Promise resolving to the configured persister
 *
 * @example
 * const store = createGameStore();
 * const persister = await createGamePersisterWithDefaults(store);
 */
export async function createGamePersisterWithDefaults(store: Store) {
  const persister = createIndexedDbPersister(store, DB_NAME);

  // Start auto-persisting with the store's current content as initial fallback
  await persister.startAutoPersisting();

  storeLogger.info('✅ IndexedDB persister initialized with defaults');
  storeLogger.debug(`   Database: ${persister.getDbName()}`);
  storeLogger.debug(`   Auto-loading: ${persister.isAutoLoading()}`);
  storeLogger.debug(`   Auto-saving: ${persister.isAutoSaving()}`);

  return persister;
}

/**
 * Stop persister and clean up
 *
 * @param persister - Persister instance to destroy
 */
export async function destroyPersister(
  persister: ReturnType<typeof createIndexedDbPersister>
) {
  await persister.destroy();
  storeLogger.info('🗑️  IndexedDB persister destroyed');
}

/**
 * Manually save the store to IndexedDB
 * Useful for ensuring data is saved before critical operations
 *
 * @param persister - Persister instance
 */
export async function manualSave(
  persister: ReturnType<typeof createIndexedDbPersister>
) {
  await persister.save();
  storeLogger.debug('💾 Manual save to IndexedDB completed');
}

/**
 * Manually load data from IndexedDB into the store
 * Useful for refreshing data or recovering from errors
 *
 * @param persister - Persister instance
 */
export async function manualLoad(
  persister: ReturnType<typeof createIndexedDbPersister>
) {
  await persister.load();
  storeLogger.debug('📥 Manual load from IndexedDB completed');
}

/**
 * Get current persister status
 *
 * @param persister - Persister instance
 * @returns Object with status information
 */
export function getPersisterStatus(
  persister: ReturnType<typeof createIndexedDbPersister>
) {
  return {
    dbName: persister.getDbName(),
    isAutoLoading: persister.isAutoLoading(),
    isAutoSaving: persister.isAutoSaving(),
    status: persister.getStatus(),
  };
}
