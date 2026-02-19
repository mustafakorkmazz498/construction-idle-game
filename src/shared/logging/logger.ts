type LogLevel = 'INFO' | 'WARN' | 'ERROR';

const APP_TAG = '[ConstructionIdleGame]';

function format(level: LogLevel, message: string): string {
  return `${APP_TAG} ${level}: ${message}`;
}

export const logger = {
  info(message: string, meta?: unknown): void {
    try {
      console.log(format('INFO', message), meta ?? '');
    } catch {
      // Never throw from logger.
    }
  },
  warn(message: string, meta?: unknown): void {
    try {
      console.warn(format('WARN', message), meta ?? '');
    } catch {
      // Never throw from logger.
    }
  },
  error(message: string, meta?: unknown): void {
    try {
      console.error(format('ERROR', message), meta ?? '');
    } catch {
      // Never throw from logger.
    }
  },
};

