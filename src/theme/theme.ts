import type { ThemeDefinition, ThemeEntry } from '../core/types.js';

export const createTheme = <T extends ThemeDefinition>(theme: T): T => theme;

export const resolveThemeEntry = (theme: ThemeDefinition, name: string): ThemeEntry => {
  const entry = theme[name];

  if (!entry) {
    throw new Error(`Unknown theme entry: "${name}"`);
  }

  return entry;
};
