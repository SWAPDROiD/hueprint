import { describe, it, expect } from 'vitest';
import {
  isPlainObject,
  toText,
  normalizeStyleOptions,
  dedupeStyles,
  supportsColor,
} from '../../src/core/utils';

describe('Core Utils', () => {
  describe('isPlainObject', () => {
    it('should return true for plain objects', () => {
      expect(isPlainObject({})).toBe(true);
      expect(isPlainObject({ a: 1, b: 'test' })).toBe(true);
    });

    it('should return false for non-objects', () => {
      expect(isPlainObject(null)).toBe(false);
      expect(isPlainObject(undefined)).toBe(false);
      expect(isPlainObject('string')).toBe(false);
      expect(isPlainObject(123)).toBe(false);
      expect(isPlainObject(true)).toBe(false);
    });

    it('should return false for arrays', () => {
      expect(isPlainObject([])).toBe(false);
      expect(isPlainObject([1, 2, 3])).toBe(false);
    });

    it('should return true for class instances (as they are still plain objects)', () => {
      class TestClass {}
      expect(isPlainObject(new TestClass())).toBe(true);
    });
  });

  describe('toText', () => {
    it('should convert strings as-is', () => {
      expect(toText('hello')).toBe('hello');
      expect(toText('Hello World')).toBe('Hello World');
      expect(toText('')).toBe('');
    });

    it('should convert numbers to strings', () => {
      expect(toText(123)).toBe('123');
      expect(toText(0)).toBe('0');
      expect(toText(-42)).toBe('-42');
      expect(toText(3.14)).toBe('3.14');
    });

    it('should convert booleans to strings', () => {
      expect(toText(true)).toBe('true');
      expect(toText(false)).toBe('false');
    });

    it('should convert bigint to strings', () => {
      expect(toText(BigInt(123))).toBe('123');
    });

    it('should convert symbols to strings', () => {
      const sym = Symbol('test');
      expect(toText(sym)).toBe('Symbol(test)');
    });

    it('should handle null and undefined', () => {
      expect(toText(null)).toBe('null');
      expect(toText(undefined)).toBe('undefined');
    });

    it('should include error stack when available', () => {
      const error = new Error('Test error');
      const result = toText(error);
      expect(result).toContain('Error: Test error');
    });

    it('should handle errors without stack trace', () => {
      const error = new Error('Test error');
      error.stack = undefined;
      expect(toText(error)).toBe('Test error');
    });

    it('should stringify objects as JSON', () => {
      expect(toText({ a: 1, b: 'test' })).toBe('{"a":1,"b":"test"}');
      expect(toText([1, 2, 3])).toBe('[1,2,3]');
    });

    it('should handle unstringifiable objects', () => {
      const circular: any = { a: 1 };
      circular.self = circular;
      const result = toText(circular);
      expect(typeof result).toBe('string');
      expect(result).toBeTruthy();
    });
  });

  describe('normalizeStyleOptions', () => {
    it('should handle empty options', () => {
      expect(normalizeStyleOptions({})).toEqual([]);
    });

    it('should include color when provided', () => {
      expect(normalizeStyleOptions({ color: 'red' })).toContain('red');
    });

    it('should include background color when provided', () => {
      expect(normalizeStyleOptions({ backgroundColor: 'bgBlue' })).toContain('bgBlue');
    });

    it('should include modifiers when provided', () => {
      const result = normalizeStyleOptions({ bold: true });
      expect(result).toContain('bold');
    });

    it('should include multiple modifiers', () => {
      const result = normalizeStyleOptions({
        bold: true,
        italic: true,
        underline: true,
      });
      expect(result).toContain('bold');
      expect(result).toContain('italic');
      expect(result).toContain('underline');
    });

    it('should exclude modifiers set to false', () => {
      const result = normalizeStyleOptions({
        bold: false,
        italic: true,
      });
      expect(result).not.toContain('bold');
      expect(result).toContain('italic');
    });

    it('should handle all modifiers', () => {
      const result = normalizeStyleOptions({
        bold: true,
        dim: true,
        italic: true,
        underline: true,
        inverse: true,
        hidden: true,
        strikethrough: true,
      });
      expect(result).toHaveLength(7);
    });

    it('should combine color, background, and modifiers', () => {
      const result = normalizeStyleOptions({
        color: 'green',
        backgroundColor: 'bgYellow',
        bold: true,
        underline: true,
      });
      expect(result).toContain('green');
      expect(result).toContain('bgYellow');
      expect(result).toContain('bold');
      expect(result).toContain('underline');
    });
  });

  describe('dedupeStyles', () => {
    it('should handle empty styles', () => {
      expect(dedupeStyles([])).toEqual([]);
    });

    it('should return single styles as-is', () => {
      expect(dedupeStyles(['red'])).toEqual(['red']);
    });

    it('should preserve order and remove duplicates', () => {
      expect(dedupeStyles(['red', 'bold', 'red'])).toEqual(['red', 'bold']);
    });

    it('should handle multiple duplicates', () => {
      expect(dedupeStyles(['red', 'red', 'bold', 'bold', 'red'])).toEqual(['red', 'bold']);
    });

    it('should maintain original order for unique items', () => {
      expect(
        dedupeStyles(['bold', 'red', 'underline', 'green', 'bold'] as any)
      ).toEqual(['bold', 'red', 'underline', 'green']);
    });

    it('should handle all same styles', () => {
      expect(dedupeStyles(['red', 'red', 'red'])).toEqual(['red']);
    });
  });

  describe('supportsColor', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should return true when enabled is explicitly true', () => {
      expect(supportsColor(true)).toBe(true);
    });

    it('should return false when enabled is explicitly false', () => {
      expect(supportsColor(false)).toBe(false);
    });

    it('should return false when NO_COLOR is set', () => {
      process.env.NO_COLOR = '1';
      expect(supportsColor()).toBe(false);
    });

    it('should return false when FORCE_COLOR is 0', () => {
      process.env.FORCE_COLOR = '0';
      expect(supportsColor()).toBe(false);
    });

    it('should return true when FORCE_COLOR is set to non-zero', () => {
      process.env.FORCE_COLOR = '1';
      expect(supportsColor()).toBe(true);
    });

    it('should return true when not explicitly disabled', () => {
      delete process.env.NO_COLOR;
      delete process.env.FORCE_COLOR;
      expect(typeof supportsColor()).toBe('boolean');
    });
  });
});
