/* eslint-disable @typescript-eslint/no-explicit-any */
// A simple structured logger for server-side environments
// Following Next.js observability best practices

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  timestamp: string;
  message: string;
  data?: any;
  [key: string]: any;
}

const formatLog = (level: LogLevel, message: string, data?: any): string => {
  const entry: LogEntry = {
    level,
    timestamp: new Date().toISOString(),
    message,
    ...(data && { data }),
  };

  // In development, pretty print. In production, output JSON for log aggregators
  if (process.env.NODE_ENV === 'development') {
    const dataStr = data ? `\n${JSON.stringify(data, null, 2)}` : '';
    return `[${entry.timestamp}] ${level.toUpperCase()}: ${message}${dataStr}`;
  }

  return JSON.stringify(entry);
};

export const logger = {
  info: (message: string, data?: any) => {
    console.info(formatLog('info', message, data));
  },
  warn: (message: string, data?: any) => {
    console.warn(formatLog('warn', message, data));
  },
  error: (message: string, data?: any) => {
    console.error(formatLog('error', message, data));
  },
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug(formatLog('debug', message, data));
    }
  },
};
