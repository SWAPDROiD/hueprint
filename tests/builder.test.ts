import { describe, it, expect, vi } from 'vitest';
import { createHueprint, createTheme } from '../src/index.js';
import type { LoggerOptions } from '../src/core/types.js';

describe('Builder Coverage', () => {
  describe('Disabled styling', () => {
    it('should return plain text when disabled with red', () => {
      const hueprint = createHueprint({ enabled: false });
      const result = hueprint.red('Test');
      expect(result).toBe('Test');
    });

    it('should return plain text when disabled with multiple chains', () => {
      const hueprint = createHueprint({ enabled: false });
      const result = hueprint.red.bold.underline('Test');
      expect(result).toBe('Test');
    });

    it('should return text directly when disabled with style method', () => {
      const hueprint = createHueprint({ enabled: false });
      const result = hueprint.style('Test', { color: 'red', bold: true });
      expect(result).toBe('Test');
    });

    it('should return object with empty style when disabled with object target', () => {
      const hueprint = createHueprint({ enabled: false });
      const result = hueprint.object.red('Test');
      expect(typeof result).toBe('object');
      expect(result.text).toBe('Test');
      expect(result.style).toEqual({});
    });

    it('should return plain text when disabled with html target', () => {
      const hueprint = createHueprint({ enabled: false });
      const result = hueprint.html.red('Test');
      expect(result).toBe('Test');
    });
  });

  describe('withTheme with logger options', () => {
    it('should preserve logger options when switching themes', () => {
      const loggerOptions: LoggerOptions = {
        success: { prefix: '→', label: 'READY' },
      };
      const h1 = createHueprint({ enabled: true, logger: loggerOptions });
      const theme = createTheme({ custom: { color: 'cyan' } });
      const h2 = h1.withTheme(theme);

      // Should still have access to format method with preserved logger options
      const result = h2.format('success', 'test');
      expect(result).toContain('READY');
      expect(result).toContain('→');
    });

    it('should work without logger options when switching themes', () => {
      const h1 = createHueprint({ enabled: true });
      const theme = createTheme({ custom: { color: 'blue' } });
      const h2 = h1.withTheme(theme);

      const result = h2.format('success', 'test');
      expect(result).toContain('SUCCESS');
      expect(result).toContain('✔');
    });

    it('should preserve enabled state when switching themes', () => {
      const h1 = createHueprint({ enabled: false });
      const theme = createTheme({ msg: { color: 'red' } });
      const h2 = h1.withTheme(theme);

      const result = h2.red('test');
      expect(result).toBe('test');
    });
  });

  describe('Direct logger method calls', () => {
    it('should call success method on root instance', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const hueprint = createHueprint({ enabled: true });
      const result = hueprint.format('success', 'Done');
      expect(result).toContain('Done');

      consoleSpy.mockRestore();
    });

    it('should call error via format method', () => {
      const hueprint = createHueprint({ enabled: true });
      const result = hueprint.format('error', 'Failed');
      expect(result).toContain('Failed');
    });

    it('should call warn via format method', () => {
      const hueprint = createHueprint({ enabled: true });
      const result = hueprint.format('warn', 'Warning');
      expect(result).toContain('Warning');
    });

    it('should call info via format method', () => {
      const hueprint = createHueprint({ enabled: true });
      const result = hueprint.format('info', 'Info');
      expect(result).toContain('Info');
    });
  });

  describe('Unknown properties', () => {
    it('should handle unknown string property on styled instance', () => {
      const hueprint = createHueprint({ enabled: true });
      const styled = hueprint.red;
      const result = (styled as any).unknownProperty;
      expect(result).toBeUndefined();
    });

    it('should handle non-string properties on styled instance', () => {
      const hueprint = createHueprint({ enabled: true });
      const styled = hueprint.red;
      const result = (styled as any)[Symbol.iterator];
      expect(result).toBeUndefined();
    });
  });

  describe('Property access on root', () => {
    it('should access style property', () => {
      const hueprint = createHueprint({ enabled: true });
      expect(typeof hueprint.style).toBe('function');
    });

    it('should access gradient property', () => {
      const hueprint = createHueprint({ enabled: true });
      expect(typeof hueprint.gradient).toBe('function');
    });

    it('should access format property', () => {
      const hueprint = createHueprint({ enabled: true });
      expect(typeof hueprint.format).toBe('function');
    });

    it('should access createLogger property', () => {
      const hueprint = createHueprint({ enabled: true });
      expect(typeof hueprint.createLogger).toBe('function');
    });

    it('should access log property', () => {
      const hueprint = createHueprint({ enabled: true });
      expect(typeof hueprint.log).toBe('object');
    });

    it('should access themed property', () => {
      const hueprint = createHueprint({ enabled: true });
      expect(typeof hueprint.themed).toBe('object');
    });

    it('should access withTheme property', () => {
      const hueprint = createHueprint({ enabled: true });
      expect(typeof hueprint.withTheme).toBe('function');
    });
  });

  describe('HTML and Object targets', () => {
    it('should work with html.red disabled', () => {
      const hueprint = createHueprint({ enabled: false });
      const result = hueprint.html.red('Test');
      expect(result).toBe('Test');
    });

    it('should work with object.red disabled', () => {
      const hueprint = createHueprint({ enabled: false });
      const result = hueprint.object.red('Test');
      expect(typeof result).toBe('object');
      expect(result.text).toBe('Test');
    });

    it('should apply styles to html.red when enabled', () => {
      const hueprint = createHueprint({ enabled: true });
      const result = hueprint.html.red('Test');
      expect(typeof result).toBe('string');
      expect(result).toContain('Test');
      expect(result).toContain('style');
    });

    it('should apply styles to object.red when enabled', () => {
      const hueprint = createHueprint({ enabled: true });
      const result = hueprint.object.red('Test');
      expect(typeof result).toBe('object');
      expect(result.text).toBe('Test');
      expect(result.style.color).toBeDefined();
    });
  });

  describe('Gradient with different targets', () => {
    it('should apply gradient to terminal target', () => {
      const hueprint = createHueprint({ enabled: true });
      const result = hueprint.gradient('AB', { colors: ['#ff0000', '#00ff00'] });
      expect(typeof result).toBe('string');
      expect(result).toContain('A');
      expect(result).toContain('B');
    });

    it('should apply gradient to html target', () => {
      const hueprint = createHueprint({ enabled: true });
      const result = hueprint.html.gradient('AB', { colors: ['#ff0000', '#00ff00'] });
      expect(typeof result).toBe('string');
    });

    it('should apply gradient to object target', () => {
      const hueprint = createHueprint({ enabled: true });
      const result = hueprint.object.gradient('AB', { colors: ['#ff0000', '#00ff00'] });
      // Gradient returns a string with ANSI codes
      expect(typeof result).toBe('string');
      expect(result).toContain('A');
      expect(result).toContain('B');
    });
  });

  describe('Theme access', () => {
    it('should access theme using themed property', () => {
      const theme = createTheme({
        primary: { color: 'blue' },
      });
      const hueprint = createHueprint({ enabled: true, theme });
      
      const themed = hueprint.themed;
      expect(typeof themed).toBe('object');
      expect(typeof themed.primary).toBe('function');
    });

    it('should use theme via themed property', () => {
      const theme = createTheme({
        success: { color: 'green', prefix: '[✓] ' },
      });
      const hueprint = createHueprint({ enabled: true, theme });
      
      const result = hueprint.themed.success('Done');
      expect(result).toContain('[✓]');
      expect(result).toContain('Done');
    });
  });
});
