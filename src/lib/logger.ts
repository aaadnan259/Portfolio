type LogLevel = "debug" | "info" | "warn" | "error";

const levels: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const getLogLevel = (): LogLevel => {
  const envLevel = process.env.LOG_LEVEL as LogLevel;
  if (envLevel && levels[envLevel] !== undefined) {
    return envLevel;
  }
  return "info";
};

const LOG_LEVEL = getLogLevel();

function shouldLog(level: LogLevel): boolean {
  const currentLevel = levels[level];
  const configuredLevel = levels[LOG_LEVEL];
  return currentLevel >= configuredLevel;
}

export const logger = {
  debug: (message: string, ...args: unknown[]) => {
    if (shouldLog("debug")) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },
  info: (message: string, ...args: unknown[]) => {
    if (shouldLog("info")) {
      console.info(`[INFO] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: unknown[]) => {
    if (shouldLog("warn")) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  error: (message: string, ...args: unknown[]) => {
    if (shouldLog("error")) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  },
};
