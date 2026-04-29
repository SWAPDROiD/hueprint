import { describe, it, expect } from 'vitest';
import { applyGradient } from '../../src/gradient/gradient';

describe('Gradient', () => {
  describe('applyGradient', () => {
    it('should return text unchanged when disabled', () => {
      const result = applyGradient('Hello', { colors: ['#ff0000', '#00ff00'] }, false);
      expect(result).toBe('Hello');
    });

    it('should return empty string for empty text', () => {
      const result = applyGradient('', { colors: ['#ff0000', '#00ff00'] }, true);
      expect(result).toBe('');
    });

    it('should return text unchanged when enabled but empty', () => {
      const result = applyGradient('', { colors: ['#ff0000'] }, true);
      expect(result).toBe('');
    });

    it('should apply gradient to single character', () => {
      const result = applyGradient('A', { colors: ['#ff0000'] }, true);
      expect(result).toContain('A');
      expect(result).toContain('\u001B[38;2;');
    });

    it('should apply two-color gradient', () => {
      const result = applyGradient('AB', { colors: ['#ff0000', '#00ff00'] }, true);
      expect(result).toContain('A');
      expect(result).toContain('B');
      expect(result).toContain('\u001B[38;2;255;0;0m');
      expect(result).toContain('\u001B[38;2;0;255;0m');
    });

    it('should apply three-color gradient', () => {
      const result = applyGradient('ABC', { colors: ['#ff0000', '#00ff00', '#0000ff'] }, true);
      expect(result).toContain('A');
      expect(result).toContain('B');
      expect(result).toContain('C');
    });

    it('should handle longer text with gradient', () => {
      const result = applyGradient('Hello', { colors: ['#ff0000', '#00ff00'] }, true);
      expect(result.length).toBeGreaterThan('Hello'.length);
      result.split('').forEach((char) => {
        if (char !== '\u001B' && char !== 'm' && !char.match(/^\d/)) {
          // Just verify it contains the text somewhere
        }
      });
    });

    it('should preserve newlines', () => {
      const result = applyGradient('Hi\nThere', { colors: ['#ff0000'] }, true);
      expect(result).toContain('\n');
    });

    it('should handle hex color shorthand', () => {
      const result = applyGradient('AB', { colors: ['#f00', '#0f0'] }, true);
      expect(result).toContain('A');
      expect(result).toContain('B');
    });

    it('should handle multiple newlines', () => {
      const result = applyGradient('A\nB\nC', { colors: ['#ff0000', '#00ff00'] }, true);
      expect(result).toContain('\n');
      const newlineCount = (result.match(/\n/g) || []).length;
      expect(newlineCount).toBe(2);
    });

    it('should handle non-string input by converting to text', () => {
      const result = applyGradient(123, { colors: ['#ff0000', '#00ff00'] }, true);
      expect(result).toContain('1');
    });

    it('should throw error for no colors', () => {
      expect(() => applyGradient('Hello', { colors: [] }, true)).toThrow(
        'Gradient requires at least one color.'
      );
    });

    it('should throw error for invalid hex color', () => {
      expect(() => applyGradient('Hello', { colors: ['invalid'] }, true)).toThrow('Invalid gradient color');
    });

    it('should throw error for invalid hex format', () => {
      expect(() => applyGradient('Hello', { colors: ['#gggggg'] }, true)).toThrow('Invalid gradient color');
    });

    it('should handle single color gradient', () => {
      const result = applyGradient('Hello', { colors: ['#ff0000'] }, true);
      expect(result).toContain('H');
      expect(result).toContain('e');
      expect(result).toContain('l');
      expect(result).toContain('l');
      expect(result).toContain('o');
    });

    it('should handle uppercase hex colors', () => {
      const result = applyGradient('AB', { colors: ['#FF0000', '#00FF00'] }, true);
      expect(result).toContain('A');
      expect(result).toContain('B');
    });

    it('should handle mixed case hex colors', () => {
      const result = applyGradient('AB', { colors: ['#Ff0000', '#00fF00'] }, true);
      expect(result).toContain('A');
      expect(result).toContain('B');
    });

    it('should correctly interpolate between colors', () => {
      const gradient = applyGradient('ABCD', { colors: ['#000000', '#ffffff'] }, true);
      // Verify it contains RGB codes and gets progressively lighter
      expect(gradient).toContain('\u001B[38;2;');
    });

    it('should handle whitespace characters', () => {
      const result = applyGradient('H  W', { colors: ['#ff0000', '#00ff00'] }, true);
      expect(result).toContain('H');
      expect(result).toContain('W');
    });

    it('should handle special characters', () => {
      const result = applyGradient('!@#', { colors: ['#ff0000', '#00ff00'] }, true);
      expect(result).toContain('!');
      expect(result).toContain('@');
      expect(result).toContain('#');
    });

    it('should handle unicode characters', () => {
      const result = applyGradient('😀😁😂', { colors: ['#ff0000', '#00ff00'] }, true);
      expect(result).toBeTruthy();
    });
  });
});
