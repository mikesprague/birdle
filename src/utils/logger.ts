/**
 * Logger Utility
 *
 * Centralized logging that respects the environment.
 * Logs are only shown in development mode.
 * In production, errors can be sent to error tracking services.
 */

import { isDev, isLocal } from './game-logic';

/**
 * Log levels for categorizing messages
 */
export type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

/**
 * Logger configuration
 */
interface LoggerConfig {
  /** Whether to enable logging (defaults to dev/local only) */
  enabled: boolean;
  /** Minimum log level to display */
  minLevel: LogLevel;
  /** Prefix for all log messages */
  prefix?: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  log: 1,
  info: 2,
  warn: 3,
  error: 4,
};

class Logger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      enabled: config.enabled ?? (isDev() || isLocal()),
      minLevel: config.minLevel ?? 'debug',
      prefix: config.prefix,
    };
  }

  /**
   * Check if a log level should be displayed
   */
  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) {
      return false;
    }
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.minLevel];
  }

  /**
   * Format a log message with prefix
   */
  private format(message: string, ...args: unknown[]): [string, ...unknown[]] {
    const prefix = this.config.prefix ? `[${this.config.prefix}] ` : '';
    return [`${prefix}${message}`, ...args];
  }

  /**
   * Log a debug message
   */
  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.debug(...this.format(message, ...args));
    }
  }

  /**
   * Log a general message
   */
  log(message: string, ...args: unknown[]): void {
    if (this.shouldLog('log')) {
      console.log(...this.format(message, ...args));
    }
  }

  /**
   * Log an informational message
   */
  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.info(...this.format(message, ...args));
    }
  }

  /**
   * Log a warning message
   */
  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(...this.format(message, ...args));
    }
  }

  /**
   * Log an error message
   * Always logs in production for error tracking
   */
  error(message: string, error?: unknown, ...args: unknown[]): void {
    // Always log errors, even in production
    console.error(...this.format(message, error, ...args));

    // In production, you could send to error tracking service
    // if (!isDev() && !isLocal()) {
    //   trackError(error, { message, ...args });
    // }
  }

  /**
   * Update logger configuration
   */
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Create default logger instances
export const logger = new Logger();

// Create specialized loggers for different parts of the app
export const storeLogger = new Logger({ prefix: 'Store' });
export const gameLogger = new Logger({ prefix: 'Game' });
export const analyticsLogger = new Logger({ prefix: 'Analytics' });
export const pwLogger = new Logger({ prefix: 'PWA' });

/**
 * Create a custom logger with specific configuration
 *
 * @example
 * const myLogger = createLogger({ prefix: 'MyFeature', minLevel: 'info' });
 * myLogger.info('Feature initialized');
 */
export function createLogger(config: Partial<LoggerConfig> = {}): Logger {
  return new Logger(config);
}
