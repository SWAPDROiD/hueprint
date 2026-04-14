import { describe, it, expect } from 'vitest';
import { createTheme, resolveThemeEntry } from '../../src/theme/theme';
import type { ThemeDefinition } from '../../src/core/types';

describe('Theme', () => {
  describe('createTheme', () => {
    it('should return the same theme object passed', () => {
      const theme: ThemeDefinition = {
        primary: { color: 'blue' },
      };
      const result = createTheme(theme);
      expect(result).toEqual(theme);
      expect(result).toBe(theme);
    });

    it('should handle empty theme', () => {
      const result = createTheme({});
      expect(result).toEqual({});
    });

    it('should preserve theme with multiple entries', () => {
      const theme: ThemeDefinition = {
        primary: { color: 'blue', bold: true },
        secondary: { color: 'green', italic: true },
        danger: { color: 'red' },
      };
      expect(createTheme(theme)).toEqual(theme);
    });

    it('should preserve prefix and suffix', () => {
      const theme: ThemeDefinition = {
        success: { color: 'green', prefix: '[✔] ', suffix: '\n' },
      };
      const result = createTheme(theme);
      expect(result.success?.prefix).toBe('[✔] ');
      expect(result.success?.suffix).toBe('\n');
    });

    it('should preserve all style options', () => {
      const theme: ThemeDefinition = {
        complex: {
          color: 'cyan',
          backgroundColor: 'bgBlack',
          bold: true,
          italic: true,
          underline: true,
          inverse: false,
          hidden: false,
          strikethrough: false,
        },
      };
      const result = createTheme(theme);
      expect(result.complex?.color).toBe('cyan');
      expect(result.complex?.backgroundColor).toBe('bgBlack');
      expect(result.complex?.bold).toBe(true);
      expect(result.complex?.italic).toBe(true);
      expect(result.complex?.underline).toBe(true);
    });
  });

  describe('resolveThemeEntry', () => {
    const theme: ThemeDefinition = {
      primary: { color: 'blue', bold: true },
      secondary: { color: 'green' },
    };

    it('should return entry for existing theme key', () => {
      const entry = resolveThemeEntry(theme, 'primary');
      expect(entry).toEqual({ color: 'blue', bold: true });
    });

    it('should return entry for different key', () => {
      const entry = resolveThemeEntry(theme, 'secondary');
      expect(entry).toEqual({ color: 'green' });
    });

    it('should throw error for non-existent key', () => {
      expect(() => resolveThemeEntry(theme, 'nonexistent')).toThrow('Unknown theme entry: "nonexistent"');
    });

    it('should throw error for empty string key', () => {
      expect(() => resolveThemeEntry(theme, '')).toThrow('Unknown theme entry: ""');
    });

    it('should throw error when theme is empty', () => {
      expect(() => resolveThemeEntry({}, 'any')).toThrow('Unknown theme entry: "any"');
    });

    it('should preserve all entry properties when resolving', () => {
      const entry = resolveThemeEntry(theme, 'primary');
      expect(entry).toHaveProperty('color');
      expect(entry).toHaveProperty('bold');
    });

    it('should handle entries with only color', () => {
      const simpleTheme: ThemeDefinition = {
        simple: { color: 'red' },
      };
      const entry = resolveThemeEntry(simpleTheme, 'simple');
      expect(entry.color).toBe('red');
    });

    it('should handle entries with prefix and suffix', () => {
      const themeWithAffixes: ThemeDefinition = {
        badge: { color: 'blue', prefix: '[', suffix: ']' },
      };
      const entry = resolveThemeEntry(themeWithAffixes, 'badge');
      expect(entry.prefix).toBe('[');
      expect(entry.suffix).toBe(']');
    });

    it('should handle entries with background colors', () => {
      const bgTheme: ThemeDefinition = {
        highlight: { backgroundColor: 'bgYellow', color: 'black' },
      };
      const entry = resolveThemeEntry(bgTheme, 'highlight');
      expect(entry.backgroundColor).toBe('bgYellow');
      expect(entry.color).toBe('black');
    });

    it('should handle entries with modifiers', () => {
      const modifierTheme: ThemeDefinition = {
        important: {
          bold: true,
          italic: true,
          underline: true,
        },
      };
      const entry = resolveThemeEntry(modifierTheme, 'important');
      expect(entry.bold).toBe(true);
      expect(entry.italic).toBe(true);
      expect(entry.underline).toBe(true);
    });

    it('should handle nested property access', () => {
      const entry = resolveThemeEntry(theme, 'primary');
      expect(entry['color']).toBe('blue');
      expect(entry['bold']).toBe(true);
    });
  });

  describe('Theme Integration', () => {
    it('should create and resolve theme together', () => {
      const theme = createTheme({
        info: { color: 'blue', prefix: '[info] ' },
        warn: { color: 'yellow', prefix: '[warn] ' },
        error: { color: 'red', prefix: '[error] ' },
      });

      expect(resolveThemeEntry(theme, 'info').prefix).toBe('[info] ');
      expect(resolveThemeEntry(theme, 'warn').prefix).toBe('[warn] ');
      expect(resolveThemeEntry(theme, 'error').prefix).toBe('[error] ');
    });

    it('should handle theme updates', () => {
      const theme = createTheme({ initial: { color: 'blue' } });
      theme.added = { color: 'green' };

      expect(resolveThemeEntry(theme, 'initial').color).toBe('blue');
      expect(resolveThemeEntry(theme, 'added').color).toBe('green');
    });
  });
});
