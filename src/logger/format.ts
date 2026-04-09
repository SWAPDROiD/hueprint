import type {
  LogLevel,
  LoggerLevelOptions,
  LoggerOptions,
  StyleOptions,
} from '../core/types.js';
import { toText } from '../core/utils.js';

const defaultPrefixes: Record<LogLevel, Required<LoggerLevelOptions>> = {
  success: {
    label: 'SUCCESS',
    prefix: '✔',
    style: { color: 'green', bold: true },
  },
  error: {
    label: 'ERROR',
    prefix: '✖',
    style: { color: 'red', bold: true },
  },
  warn: {
    label: 'WARN',
    prefix: '▲',
    style: { color: 'yellow', bold: true },
  },
  info: {
    label: 'INFO',
    prefix: '●',
    style: { color: 'blue', bold: true },
  },
};

export const resolveLevelOptions = (
  level: LogLevel,
  loggerOptions?: LoggerOptions,
): Required<LoggerLevelOptions> => ({
  ...defaultPrefixes[level],
  ...loggerOptions?.[level],
  style: {
    ...defaultPrefixes[level].style,
    ...(loggerOptions?.[level]?.style as StyleOptions | undefined),
  },
});

export const joinLogInput = (...input: unknown[]): string => input.map((part) => toText(part)).join(' ');
