import { describe, it, expect, vi } from 'vitest';
import { createHueprint, createTheme } from '../src/index.js';

describe('Hueprint Integration', () => {
  describe('createHueprint', () => {
    it('should create hueprint instance', () => {
      const hueprint = createHueprint();
      expect(hueprint).toBeDefined();
      expect(typeof hueprint).toBe('function');
    });

    it('should have all color methods', () => {
      const hueprint = createHueprint({ enabled: true });

      expect(typeof hueprint.red).toBe('function');
      expect(typeof hueprint.green).toBe('function');
      expect(typeof hueprint.blue).toBe('function');
      expect(typeof hueprint.yellow).toBe('function');
      expect(typeof hueprint.cyan).toBe('function');
      expect(typeof hueprint.magenta).toBe('function');
      expect(typeof hueprint.black).toBe('function');
      expect(typeof hueprint.white).toBe('function');
      expect(typeof hueprint.gray).toBe('function');
    });

    it('should have background color methods', () => {
      const hueprint = createHueprint({ enabled: true });

      expect(typeof hueprint.bgRed).toBe('function');
      expect(typeof hueprint.bgGreen).toBe('function');
      expect(typeof hueprint.bgBlue).toBe('function');
      expect(typeof hueprint.bgYellow).toBe('function');
    });

    it('should have modifier methods', () => {
      const hueprint = createHueprint({ enabled: true });

      expect(typeof hueprint.bold).toBe('function');
      expect(typeof hueprint.italic).toBe('function');
      expect(typeof hueprint.underline).toBe('function');
      expect(typeof hueprint.dim).toBe('function');
      expect(typeof hueprint.inverse).toBe('function');
      expect(typeof hueprint.hidden).toBe('function');
      expect(typeof hueprint.strikethrough).toBe('function');
    });

    it('should apply red color', () => {
      const hueprint = createHueprint({ enabled: true });
      const result = hueprint.red('Hello');
      expect(result).toContain('\u001B[31m');
      expect(result).toContain('Hello');
    });

    it('should chain colors and modifiers', () => {
      const hueprint = createHueprint({ enabled: true });
      const result = hueprint.red.bold('Hello');
      expect(result).toContain('\u001B[31m');
      expect(result).toContain('\u001B[1m');
      expect(result).toContain('Hello');
    });

    it('should support style method', () => {
      const hueprint = createHueprint({ enabled: true });
      const result = hueprint.style('Hello', { color: 'red', bold: true });
      expect(result).toContain('Hello');
    });

    it('should support gradient method', () => {
      const hueprint = createHueprint({ enabled: true });
      const result = hueprint.gradient('Hi', { colors: ['#ff0000', '#00ff00'] });
      expect(result).toContain('H');
      expect(result).toContain('i');
    });

    it('should support theme method', () => {
      const theme = createTheme({
        success: { color: 'green', prefix: '[✔] ' },
      });
      const hueprint = createHueprint({ enabled: true, theme });
      const result = hueprint.theme('success', 'Ready');
      expect(result).toContain('[✔]');
      expect(result).toContain('Ready');
    });

    it('should support format method', () => {
      const hueprint = createHueprint({ enabled: true });
      const result = hueprint.format('success', 'Done');
      expect(result).toContain('SUCCESS');
      expect(result).toContain('✔');
      expect(result).toContain('Done');
    });

    it('should support withTheme method', () => {
      const hueprint = createHueprint({ enabled: true });
      const newTheme = createTheme({ custom: { color: 'cyan' } });
      const newInstance = hueprint.withTheme(newTheme);

      expect(newInstance).toBeDefined();
      expect(typeof newInstance).toBe('function');
    });

    it('should support logger methods', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const hueprint = createHueprint({ enabled: true });
      expect(typeof hueprint.success).toBe('function');
      expect(typeof hueprint.error).toBe('function');
      expect(typeof hueprint.warn).toBe('function');
      expect(typeof hueprint.info).toBe('function');

      consoleSpy.mockRestore();
    });

    it('should have html renderer', () => {
      const hueprint = createHueprint({ enabled: true });
      expect(hueprint.html).toBeDefined();
      expect(typeof hueprint.html.red).toBe('function');
    });

    it('should have object renderer', () => {
      const hueprint = createHueprint({ enabled: true });
      expect(hueprint.object).toBeDefined();
      expect(typeof hueprint.object.red).toBe('function');
    });

    it('should return plain text when disabled', () => {
      const hueprint = createHueprint({ enabled: false });
      const result = hueprint.red.bold('Hello');
      expect(result).toBe('Hello');
    });

    it('should respect enabled option', () => {
      const hueprintEnabled = createHueprint({ enabled: true });
      const hueprintDisabled = createHueprint({ enabled: false });

      const text = 'test';
      const resultEnabled = hueprintEnabled.red(text);
      const resultDisabled = hueprintDisabled.red(text);

      expect(resultEnabled).not.toBe(resultDisabled);
      expect(resultDisabled).toBe(text);
    });

    it('should apply theme with prefix and suffix', () => {
      const theme = createTheme({
        badge: { color: 'blue', prefix: '[', suffix: ']' },
      });
      const hueprint = createHueprint({ enabled: true, theme });
      const result = hueprint.theme('badge', 'BADGE');

      expect(result).toContain('[');
      expect(result).toContain(']');
      expect(result).toContain('BADGE');
    });

    it('should handle multiple style chaining', () => {
      const hueprint = createHueprint({ enabled: true });
      const result = hueprint.red.bold.underline('Complex');

      expect(result).toContain('\u001B[31m');
      expect(result).toContain('\u001B[1m');
      expect(result).toContain('\u001B[4m');
      expect(result).toContain('Complex');
    });

    it('should work with html renderer', () => {
      const hueprint = createHueprint({ enabled: true });
      const result = hueprint.html.red('Text');

      expect(typeof result).toBe('string');
      expect(result).toContain('Text');
      expect(result).toContain('style');
    });

    it('should work with object renderer', () => {
      const hueprint = createHueprint({ enabled: true });
      const result = hueprint.object.red('Text');

      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('text');
      expect(result).toHaveProperty('style');
      expect(result.text).toBe('Text');
    });

    it('should apply custom logger options', () => {
      const loggerOptions = {
        success: { prefix: '→', label: 'READY' },
      };
      const hueprint = createHueprint({ enabled: true, logger: loggerOptions });
      const result = hueprint.format('success', 'Go');

      expect(result).toContain('READY');
      expect(result).toContain('→');
    });

    it('should handle number input', () => {
      const hueprint = createHueprint({ enabled: true });
      const result = hueprint.red(42);

      expect(result).toContain('42');
    });

    it('should handle object input', () => {
      const hueprint = createHueprint({ enabled: true });
      const result = hueprint.red({ key: 'value' });

      expect(result).toContain('key');
      expect(result).toContain('value');
    });

    it('should handle array input', () => {
      const hueprint = createHueprint({ enabled: true });
      const result = hueprint.red([1, 2, 3]);

      expect(result).toContain('1');
      expect(result).toContain('2');
      expect(result).toContain('3');
    });

    it('should handle empty string', () => {
      const hueprint = createHueprint({ enabled: true });
      const result = hueprint.red('');

      // Empty strings still get ANSI codes applied
      expect(result).toContain('\u001B[31m');
      expect(result).toContain('\u001B[39m');
    });
  });

  describe('Multiple hueprint instances', () => {
    it('should create independent instances', () => {
      const h1 = createHueprint({ enabled: true });
      const h2 = createHueprint({ enabled: false });

      const result1 = h1.red('test');
      const result2 = h2.red('test');

      expect(result1).not.toBe(result2);
    });

    it('should support different themes', () => {
      const theme1 = createTheme({ msg: { color: 'red' } });
      const theme2 = createTheme({ msg: { color: 'green' } });

      const h1 = createHueprint({ enabled: true, theme: theme1 });
      const h2 = createHueprint({ enabled: true, theme: theme2 });

      expect(h1.theme('msg', 'test')).toContain('31m');
      expect(h2.theme('msg', 'test')).toContain('32m');
    });
  });

  describe('Additional API methods', () => {
    it('should support log property (convenience accessor)', () => {
      const hueprint = createHueprint({ enabled: true });
      expect(typeof hueprint.log).toBe('object');
      expect(typeof hueprint.log.success).toBe('function');
    });

    it('should support createLogger property', () => {
      const hueprint = createHueprint({ enabled: true });
      expect(typeof hueprint.createLogger).toBe('function');
    });

    it('should support themed property for theme access', () => {
      const theme = createTheme({
        badge: { color: 'blue' },
      });
      const hueprint = createHueprint({ enabled: true, theme });
      expect(typeof hueprint.themed).toBe('object');
    });

    it('should support hidden modifier', () => {
      const hueprint = createHueprint({ enabled: true });
      const result = hueprint.hidden('Hidden');
      expect(result).toContain('Hidden');
      expect(result).toContain('\u001B[8m');
    });
  });

  describe('Edge cases', () => {
    it('should handle null gracefully', () => {
      const hueprint = createHueprint({ enabled: true });
      const result = hueprint.red(null as any);
      expect(typeof result).toBe('string');
      expect(result).toContain('null');
    });

    it('should handle undefined gracefully', () => {
      const hueprint = createHueprint({ enabled: true });
      const result = hueprint.red(undefined as any);
      expect(typeof result).toBe('string');
      expect(result).toContain('undefined');
    });

    it('should handle very long strings', () => {
      const hueprint = createHueprint({ enabled: true });
      const longString = 'a'.repeat(10000);
      const result = hueprint.red(longString);

      expect(result).toContain('a');
      expect(result.length).toBeGreaterThan(longString.length);
    });

    it('should handle theme method with invalid key gracefully', () => {
      const hueprint = createHueprint({ enabled: true });
      expect(() => hueprint.theme('nonexistent', 'text')).toThrow();
    });

    it('should handle mixed modifiers and colors', () => {
      const hueprint = createHueprint({ enabled: true });
      const result = hueprint.bgYellow.black.bold('Warn');

      expect(result).toContain('Warn');
      expect(result).toContain('\u001B[30m');
      expect(result).toContain('\u001B[43m');
      expect(result).toContain('\u001B[1m');
    });
  });

  describe('Default export', () => {
    it('should export default hueprint instance', async () => {
      const defaultModule = await import('../../src/index.js');
      const hueprint = defaultModule.default;

      expect(hueprint).toBeDefined();
      expect(typeof hueprint).toBe('function');
      expect(typeof hueprint.red).toBe('function');
    });
  });
});
