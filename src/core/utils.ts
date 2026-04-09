import type { StyleName, StyleOptions } from './types.js';

export const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const toText = (input: unknown): string => {
  if (typeof input === 'string') {
    return input;
  }

  if (
    typeof input === 'number' ||
    typeof input === 'boolean' ||
    typeof input === 'bigint' ||
    typeof input === 'symbol'
  ) {
    return String(input);
  }

  if (input instanceof Error) {
    return input.stack ?? input.message;
  }

  if (input === null || input === undefined) {
    return String(input);
  }

  try {
    return JSON.stringify(input);
  } catch {
    return String(input);
  }
};

export const normalizeStyleOptions = (options: StyleOptions): StyleName[] => {
  const names: StyleName[] = [];

  if (options.color) {
    names.push(options.color);
  }

  if (options.backgroundColor) {
    names.push(options.backgroundColor);
  }

  const modifierNames: Array<Exclude<keyof StyleOptions, 'color' | 'backgroundColor'>> = [
    'bold',
    'dim',
    'italic',
    'underline',
    'inverse',
    'hidden',
    'strikethrough',
  ];

  for (const modifier of modifierNames) {
    if (options[modifier]) {
      names.push(modifier);
    }
  }

  return names;
};

export const dedupeStyles = (styles: readonly StyleName[]): StyleName[] => {
  const seen = new Set<StyleName>();
  const result: StyleName[] = [];

  for (const style of styles) {
    if (!seen.has(style)) {
      seen.add(style);
      result.push(style);
    }
  }

  return result;
};

export const supportsColor = (enabled?: boolean): boolean => {
  if (typeof enabled === 'boolean') {
    return enabled;
  }

  if (typeof process === 'undefined') {
    return true;
  }

  if ('NO_COLOR' in process.env) {
    return false;
  }

  if (process.env.FORCE_COLOR === '0') {
    return false;
  }

  if (process.env.FORCE_COLOR) {
    return true;
  }

  return Boolean(process.stdout?.isTTY);
};
