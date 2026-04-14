import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolveLevelOptions, joinLogInput } from '../../src/logger/format';
import { createLogger, formatLogMessage } from '../../src/logger/logger';
import type { LoggerOptions } from '../../src/core/types';

describe('Logger Format', () => {
  describe('resolveLevelOptions', () => {
    it('should provide default success options', () => {
      const options = resolveLevelOptions('success');
      expect(options.label).toBe('SUCCESS');
      expect(options.prefix).toBe('✔');
      expect(options.style).toEqual({ color: 'green', bold: true });
    });

    it('should provide default error options', () => {
      const options = resolveLevelOptions('error');
      expect(options.label).toBe('ERROR');
      expect(options.prefix).toBe('✖');
      expect(options.style).toEqual({ color: 'red', bold: true });
    });

    it('should provide default warn options', () => {
      const options = resolveLevelOptions('warn');
      expect(options.label).toBe('WARN');
      expect(options.prefix).toBe('▲');
      expect(options.style).toEqual({ color: 'yellow', bold: true });
    });

    it('should provide default info options', () => {
      const options = resolveLevelOptions('info');
      expect(options.label).toBe('INFO');
      expect(options.prefix).toBe('●');
      expect(options.style).toEqual({ color: 'blue', bold: true });
    });

    it('should override success options', () => {
      const loggerOptions: LoggerOptions = {
        success: { label: 'OK', prefix: '✓' },
      };
      const options = resolveLevelOptions('success', loggerOptions);
      expect(options.label).toBe('OK');
      expect(options.prefix).toBe('✓');
      expect(options.style?.color).toBe('green');
    });

    it('should override style while keeping other defaults', () => {
      const loggerOptions: LoggerOptions = {
        error: { style: { color: 'magenta' } },
      };
      const options = resolveLevelOptions('error', loggerOptions);
      expect(options.style.color).toBe('magenta');
      expect(options.label).toBe('ERROR');
      expect(options.prefix).toBe('✖');
    });

    it('should merge custom logger options with defaults', () => {
      const loggerOptions: LoggerOptions = {
        info: {
          label: 'CUSTOM',
          style: { bold: false },
        },
      };
      const options = resolveLevelOptions('info', loggerOptions);
      expect(options.label).toBe('CUSTOM');
      expect(options.style.color).toBe('blue');
      expect(options.style.bold).toBe(false);
    });

    it('should handle undefined logger options', () => {
      const options = resolveLevelOptions('success', undefined);
      expect(options.label).toBe('SUCCESS');
      expect(options.prefix).toBe('✔');
    });
  });

  describe('joinLogInput', () => {
    it('should join single string', () => {
      expect(joinLogInput('hello')).toBe('hello');
    });

    it('should join multiple strings with space', () => {
      expect(joinLogInput('hello', 'world')).toBe('hello world');
    });

    it('should convert numbers to strings', () => {
      expect(joinLogInput('count:', 42)).toBe('count: 42');
    });

    it('should convert objects to JSON', () => {
      expect(joinLogInput({ a: 1 })).toBe('{"a":1}');
    });

    it('should handle empty input', () => {
      expect(joinLogInput()).toBe('');
    });

    it('should handle multiple mixed types', () => {
      const result = joinLogInput('Error:', 500, { code: 'E001' });
      expect(result).toContain('Error:');
      expect(result).toContain('500');
      expect(result).toContain('code');
    });

    it('should handle null and undefined', () => {
      expect(joinLogInput(null, undefined, 'text')).toContain('null');
      expect(joinLogInput(null, undefined, 'text')).toContain('undefined');
    });

    it('should handle arrays', () => {
      expect(joinLogInput([1, 2, 3])).toBe('[1,2,3]');
    });

    it('should handle boolean values', () => {
      expect(joinLogInput('flag:', true)).toBe('flag: true');
    });
  });
});

describe('Logger Creation', () => {
  describe('createLogger', () => {
    it('should create logger with all methods', () => {
      const formatter = vi.fn(() => 'formatted');
      const logger = createLogger(formatter);

      expect(logger).toHaveProperty('success');
      expect(logger).toHaveProperty('error');
      expect(logger).toHaveProperty('warn');
      expect(logger).toHaveProperty('info');
    });

    it('should call console.log for success', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const formatter = vi.fn(() => 'success message');
      const logger = createLogger(formatter);

      logger.success('test');
      expect(consoleSpy).toHaveBeenCalledWith('success message');
      expect(formatter).toHaveBeenCalledWith('success', 'test');

      consoleSpy.mockRestore();
    });

    it('should call console.error for error', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const formatter = vi.fn(() => 'error message');
      const logger = createLogger(formatter);

      logger.error('test');
      expect(consoleSpy).toHaveBeenCalledWith('error message');
      expect(formatter).toHaveBeenCalledWith('error', 'test');

      consoleSpy.mockRestore();
    });

    it('should call console.warn for warn', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const formatter = vi.fn(() => 'warn message');
      const logger = createLogger(formatter);

      logger.warn('test');
      expect(consoleSpy).toHaveBeenCalledWith('warn message');
      expect(formatter).toHaveBeenCalledWith('warn', 'test');

      consoleSpy.mockRestore();
    });

    it('should call console.info for info', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      const formatter = vi.fn(() => 'info message');
      const logger = createLogger(formatter);

      logger.info('test');
      expect(consoleSpy).toHaveBeenCalledWith('info message');
      expect(formatter).toHaveBeenCalledWith('info', 'test');

      consoleSpy.mockRestore();
    });

    it('should handle multiple arguments', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const formatter = vi.fn(() => 'message');
      const logger = createLogger(formatter);

      logger.success('a', 'b', 'c');
      expect(formatter).toHaveBeenCalledWith('success', 'a', 'b', 'c');

      consoleSpy.mockRestore();
    });
  });

  describe('formatLogMessage', () => {
    it('should format success message', () => {
      const styleApplier = vi.fn((text: string) => `[styled]${text}[/styled]`);
      const result = formatLogMessage('success', undefined, styleApplier, 'Test message');

      expect(result).toContain('Test message');
      expect(styleApplier).toHaveBeenCalled();
    });

    it('should include badge in formatted message', () => {
      const styleApplier = vi.fn((text: string) => text);
      const result = formatLogMessage('success', undefined, styleApplier, 'Ready');

      expect(result).toContain('SUCCESS');
      expect(result).toContain('✔');
      expect(result).toContain('Ready');
    });

    it('should apply custom logger options to message', () => {
      const styleApplier = vi.fn((text: string) => text);
      const loggerOptions: LoggerOptions = {
        error: { prefix: 'FAIL', label: 'FAILED' },
      };

      const result = formatLogMessage('error', loggerOptions, styleApplier, 'Process failed');

      expect(result).toContain('FAILED');
      expect(result).toContain('Process failed');
    });

    it('should handle empty message', () => {
      const styleApplier = vi.fn((text: string) => text);
      const result = formatLogMessage('success', undefined, styleApplier);

      expect(result).toContain('✔');
      expect(result).toContain('SUCCESS');
    });

    it('should handle multiple message parts', () => {
      const styleApplier = vi.fn((text: string) => text);
      const result = formatLogMessage('info', undefined, styleApplier, 'Loaded', 'config', 'file');

      expect(result).toContain('Loaded');
      expect(result).toContain('config');
      expect(result).toContain('file');
    });

    it('should apply style to badge', () => {
      const styleApplier = vi.fn((text: string, style: any) => {
        if (style?.color === 'green') {
          return `[GREEN]${text}[/GREEN]`;
        }
        return text;
      });

      const result = formatLogMessage('success', undefined, styleApplier, 'Done');

      expect(result).toContain('[GREEN]');
      expect(result).toContain('Done');
    });

    it('should handle warn level', () => {
      const styleApplier = vi.fn((text: string) => text);
      const result = formatLogMessage('warn', undefined, styleApplier, 'Deprecated');

      expect(result).toContain('▲');
      expect(result).toContain('WARN');
      expect(result).toContain('Deprecated');
    });

    it('should handle info level', () => {
      const styleApplier = vi.fn((text: string) => text);
      const result = formatLogMessage('info', undefined, styleApplier, 'Starting');

      expect(result).toContain('●');
      expect(result).toContain('INFO');
      expect(result).toContain('Starting');
    });

    it('should handle error level', () => {
      const styleApplier = vi.fn((text: string) => text);
      const result = formatLogMessage('error', undefined, styleApplier, 'Failed');

      expect(result).toContain('✖');
      expect(result).toContain('ERROR');
      expect(result).toContain('Failed');
    });
  });
});
