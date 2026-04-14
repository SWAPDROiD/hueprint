import { describe, it, expect } from 'vitest';
import { buildHueprint } from '../src/core/builder.js';
import { createTheme } from '../src/index.js';

describe('Builder - Direct Target Support', () => {
  describe('object target styling', () => {
    it('should return object with style when using object target and enabled', () => {
      const hueprint = buildHueprint({ enabled: true, target: 'object' });
      const result = hueprint.red('Test');
      expect(typeof result).toBe('object');
      expect(result.text).toBe('Test');
      expect(result.style.color).toBe('#ef4444');
    });

    it('should return object with empty style when object target and disabled', () => {
      const hueprint = buildHueprint({ enabled: false, target: 'object' });
      const result = hueprint.red('Test');
      expect(typeof result).toBe('object');
      expect(result.text).toBe('Test');
      expect(result.style).toEqual({});
    });

    it('should apply multiple styles with object target', () => {
      const hueprint = buildHueprint({ enabled: true, target: 'object' });
      const result = hueprint.style('Test', { color: 'green', bold: true });
      expect(result.text).toBe('Test');
      expect(result.style.color).toBe('#10b981');
      expect(result.style.fontWeight).toBe('bold');
    });

    it('should apply theme with object target', () => {
      const theme = createTheme({
        primary: { color: 'blue', prefix: '[', suffix: ']' },
      });
      const hueprint = buildHueprint({ enabled: true, target: 'object', theme });
      const result = hueprint.theme('primary', 'Content');
      
      expect(typeof result).toBe('object');
      expect(result.text).toBe('[Content]');
      expect(result.style.color).toBe('#3b82f6');
    });
  });

  describe('html target styling', () => {
    it('should return HTML string with style when using html target and enabled', () => {
      const hueprint = buildHueprint({ enabled: true, target: 'html' });
      const result = hueprint.red('Test');
      expect(typeof result).toBe('string');
      expect(result).toContain('Test');
      expect(result).toContain('style');
      expect(result).toContain('color');
    });

    it('should return plain text when html target and disabled', () => {
      const hueprint = buildHueprint({ enabled: false, target: 'html' });
      const result = hueprint.red('Test');
      expect(result).toBe('Test');
    });

    it('should apply multiple styles with html target', () => {
      const hueprint = buildHueprint({ enabled: true, target: 'html' });
      const result = hueprint.style('Test', { color: 'green', bold: true });
      expect(result).toContain('Test');
      expect(result).toContain('color');
      expect(result).toContain('font-weight:bold');
    });

    it('should apply theme with html target', () => {
      const theme = createTheme({
        primary: { color: 'blue', prefix: '[', suffix: ']' },
      });
      const hueprint = buildHueprint({ enabled: true, target: 'html', theme });
      const result = hueprint.theme('primary', 'Content');
      
      expect(typeof result).toBe('string');
      expect(result).toContain('[');
      expect(result).toContain('Content');
      expect(result).toContain(']');
      expect(result).toContain('color');
    });
  });

  describe('terminal target styling', () => {
    it('should return ANSI-formatted string with terminal target and enabled', () => {
      const hueprint = buildHueprint({ enabled: true, target: 'terminal' });
      const result = hueprint.red('Test');
      expect(typeof result).toBe('string');
      expect(result).toContain('Test');
      expect(result).toContain('\u001B[31m');
    });

    it('should return plain text when terminal target and disabled', () => {
      const hueprint = buildHueprint({ enabled: false, target: 'terminal' });
      const result = hueprint.red('Test');
      expect(result).toBe('Test');
    });

    it('should apply theme with terminal target', () => {
      const theme = createTheme({
        primary: { color: 'blue', prefix: '[', suffix: ']' },
      });
      const hueprint = buildHueprint({ enabled: true, target: 'terminal', theme });
      const result = hueprint.theme('primary', 'Content');
      
      expect(typeof result).toBe('string');
      expect(result).toContain('[');
      expect(result).toContain('Content');
      expect(result).toContain(']');
      expect(result).toContain('\u001B[34m');
    });
  });

  describe('combined styleText with different targets', () => {
    it('should apply style method to object target', () => {
      const hueprint = buildHueprint({ enabled: true, target: 'object' });
      const result = hueprint.style('Test', {
        color: 'red',
        backgroundColor: 'bgBlue',
        bold: true,
      });

      expect(typeof result).toBe('object');
      expect(result.text).toBe('Test');
      expect(result.style.color).toBe('#ef4444');
      expect(result.style.backgroundColor).toBe('#3b82f6');
      expect(result.style.fontWeight).toBe('bold');
    });

    it('should apply style method to html target', () => {
      const hueprint = buildHueprint({ enabled: true, target: 'html' });
      const result = hueprint.style('Test', {
        color: 'red',
        backgroundColor: 'bgBlue',
        bold: true,
      });

      expect(typeof result).toBe('string');
      expect(result).toContain('Test');
      expect(result).toContain('color');
      expect(result).toContain('background-color');
      expect(result).toContain('font-weight');
    });
  });

  describe('theme prefix and suffix handling', () => {
    it('should include prefix and suffix in object target output', () => {
      const theme = createTheme({
        badge: { color: 'green', prefix: '✓ ', suffix: ' [done]' },
      });
      const hueprint = buildHueprint({ enabled: true, target: 'object', theme });
      const result = hueprint.theme('badge', 'Task');

      expect(result.text).toBe('✓ Task [done]');
    });

    it('should include prefix and suffix in html target output', () => {
      const theme = createTheme({
        badge: { color: 'green', prefix: '✓ ', suffix: ' [done]' },
      });
      const hueprint = buildHueprint({ enabled: true, target: 'html', theme });
      const result = hueprint.theme('badge', 'Task');

      // HTML wraps just the content, prefix/suffix are outside the span
      expect(result).toContain('✓');
      expect(result).toContain('Task');
      expect(result).toContain('[done]');
    });

    it('should include prefix and suffix in terminal target output', () => {
      const theme = createTheme({
        badge: { color: 'green', prefix: '✓ ', suffix: ' [done]' },
      });
      const hueprint = buildHueprint({ enabled: true, target: 'terminal', theme });
      const result = hueprint.theme('badge', 'Task');

      // ANSI codes are applied to content, prefix/suffix are outside
      expect(result).toContain('✓');
      expect(result).toContain('Task');
      expect(result).toContain('[done]');
    });

    it('should handle null prefix and suffix', () => {
      const theme = createTheme({
        plain: { color: 'red' },
      });
      const hueprint = buildHueprint({ enabled: true, target: 'object', theme });
      const result = hueprint.theme('plain', 'Text');

      expect(result.text).toBe('Text');
    });
  });

  describe('gradient with different targets', () => {
    it('should apply gradient to object target', () => {
      const hueprint = buildHueprint({ enabled: true, target: 'object' });
      const result = hueprint.gradient('AB', { colors: ['#ff0000', '#00ff00'] });
      // Gradient returns ANSI even with object target
      expect(typeof result).toBe('string');
    });

    it('should apply gradient to html target', () => {
      const hueprint = buildHueprint({ enabled: true, target: 'html' });
      const result = hueprint.gradient('AB', { colors: ['#ff0000', '#00ff00'] });
      expect(typeof result).toBe('string');
    });

    it('should return plain text when gradient disabled with enabled: false', () => {
      const hueprint = buildHueprint({ enabled: false, target: 'object' });
      const result = hueprint.gradient('AB', { colors: ['#ff0000', '#00ff00'] });
      expect(result).toBe('AB');
    });
  });

  describe('format method with different targets', () => {
    it('should format message with object target', () => {
      const hueprint = buildHueprint({ enabled: true, target: 'object' });
      const result = hueprint.format('success', 'Completed');
      // format returns a string with ANSI codes
      expect(typeof result).toBe('string');
      expect(result).toContain('Completed');
    });

    it('should format message with html target', () => {
      const hueprint = buildHueprint({ enabled: true, target: 'html' });
      const result = hueprint.format('success', 'Completed');
      expect(typeof result).toBe('string');
      expect(result).toContain('Completed');
    });

    it('should format message with terminal target', () => {
      const hueprint = buildHueprint({ enabled: true, target: 'terminal' });
      const result = hueprint.format('success', 'Completed');
      expect(typeof result).toBe('string');
      expect(result).toContain('Completed');
      expect(result).toContain('\u001B');
    });
  });
});
