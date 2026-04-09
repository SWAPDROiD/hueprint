import type { LogHelpers, LogLevel, LoggerOptions } from '../core/types.js';
import { resolveLevelOptions, joinLogInput } from './format.js';

export const createLogger = (
  formatter: (level: LogLevel, ...input: unknown[]) => string,
): LogHelpers => ({
  success: (...input: unknown[]) => console.log(formatter('success', ...input)),
  error: (...input: unknown[]) => console.error(formatter('error', ...input)),
  warn: (...input: unknown[]) => console.warn(formatter('warn', ...input)),
  info: (...input: unknown[]) => console.info(formatter('info', ...input)),
});

export const formatLogMessage = (
  level: LogLevel,
  loggerOptions: LoggerOptions | undefined,
  applyStyle: (text: string, options: NonNullable<ReturnType<typeof resolveLevelOptions>['style']>) => string,
  ...input: unknown[]
): string => {
  const resolved = resolveLevelOptions(level, loggerOptions);
  const badge = applyStyle(`${resolved.prefix} ${resolved.label}`, resolved.style);
  const message = joinLogInput(...input);
  return message ? `${badge} ${message}` : badge;
};
