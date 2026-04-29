import { describe, it, expect } from 'vitest';
import {
  colorCodes,
  backgroundColorCodes,
  modifierCodes,
  ansiCodes,
  rgbForeground,
} from '../../src/core/ansi';

describe('ANSI Codes', () => {
  describe('colorCodes', () => {
    it('should have all foreground colors', () => {
      const colors = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray'] as const;
      for (const color of colors) {
        expect((colorCodes as Record<string, any>)[color]).toBeDefined();
        expect((colorCodes as Record<string, any>)[color]).toHaveProperty('open');
        expect((colorCodes as Record<string, any>)[color]).toHaveProperty('close');
      }
    });

    it('should have correct open codes', () => {
      expect(colorCodes.black.open).toBe('\u001B[30m');
      expect(colorCodes.red.open).toBe('\u001B[31m');
      expect(colorCodes.green.open).toBe('\u001B[32m');
      expect(colorCodes.yellow.open).toBe('\u001B[33m');
      expect(colorCodes.blue.open).toBe('\u001B[34m');
      expect(colorCodes.magenta.open).toBe('\u001B[35m');
      expect(colorCodes.cyan.open).toBe('\u001B[36m');
      expect(colorCodes.white.open).toBe('\u001B[37m');
      expect(colorCodes.gray.open).toBe('\u001B[90m');
    });

    it('should have correct close codes', () => {
      for (const color of Object.values(colorCodes)) {
        expect(color.close).toBe('\u001B[39m');
      }
    });
  });

  describe('backgroundColorCodes', () => {
    it('should have all background colors', () => {
      const colors = [
        'bgBlack',
        'bgRed',
        'bgGreen',
        'bgYellow',
        'bgBlue',
        'bgMagenta',
        'bgCyan',
        'bgWhite',
        'bgGray',
      ] as const;
      for (const color of colors) {
        expect((backgroundColorCodes as Record<string, any>)[color]).toBeDefined();
        expect((backgroundColorCodes as Record<string, any>)[color]).toHaveProperty('open');
        expect((backgroundColorCodes as Record<string, any>)[color]).toHaveProperty('close');
      }
    });

    it('should have correct open codes', () => {
      expect(backgroundColorCodes.bgBlack.open).toBe('\u001B[40m');
      expect(backgroundColorCodes.bgRed.open).toBe('\u001B[41m');
      expect(backgroundColorCodes.bgGreen.open).toBe('\u001B[42m');
      expect(backgroundColorCodes.bgYellow.open).toBe('\u001B[43m');
      expect(backgroundColorCodes.bgBlue.open).toBe('\u001B[44m');
      expect(backgroundColorCodes.bgMagenta.open).toBe('\u001B[45m');
      expect(backgroundColorCodes.bgCyan.open).toBe('\u001B[46m');
      expect(backgroundColorCodes.bgWhite.open).toBe('\u001B[47m');
      expect(backgroundColorCodes.bgGray.open).toBe('\u001B[100m');
    });

    it('should have correct close codes', () => {
      for (const color of Object.values(backgroundColorCodes)) {
        expect(color.close).toBe('\u001B[49m');
      }
    });
  });

  describe('modifierCodes', () => {
    it('should have all modifiers', () => {
      const modifiers = ['bold', 'dim', 'italic', 'underline', 'inverse', 'hidden', 'strikethrough'] as const;
      for (const modifier of modifiers) {
        expect((modifierCodes as Record<string, any>)[modifier]).toBeDefined();
        expect((modifierCodes as Record<string, any>)[modifier]).toHaveProperty('open');
        expect((modifierCodes as Record<string, any>)[modifier]).toHaveProperty('close');
      }
    });

    it('should have correct modifier codes', () => {
      expect(modifierCodes.bold.open).toBe('\u001B[1m');
      expect(modifierCodes.bold.close).toBe('\u001B[22m');
      expect(modifierCodes.dim.open).toBe('\u001B[2m');
      expect(modifierCodes.dim.close).toBe('\u001B[22m');
      expect(modifierCodes.italic.open).toBe('\u001B[3m');
      expect(modifierCodes.italic.close).toBe('\u001B[23m');
      expect(modifierCodes.underline.open).toBe('\u001B[4m');
      expect(modifierCodes.underline.close).toBe('\u001B[24m');
      expect(modifierCodes.inverse.open).toBe('\u001B[7m');
      expect(modifierCodes.inverse.close).toBe('\u001B[27m');
      expect(modifierCodes.hidden.open).toBe('\u001B[8m');
      expect(modifierCodes.hidden.close).toBe('\u001B[28m');
      expect(modifierCodes.strikethrough.open).toBe('\u001B[9m');
      expect(modifierCodes.strikethrough.close).toBe('\u001B[29m');
    });
  });

  describe('ansiCodes', () => {
    it('should contain all colors', () => {
      for (const color of Object.keys(colorCodes)) {
        expect((ansiCodes as Record<string, any>)[color]).toBeDefined();
      }
    });

    it('should contain all background colors', () => {
      for (const color of Object.keys(backgroundColorCodes)) {
        expect((ansiCodes as Record<string, any>)[color]).toBeDefined();
      }
    });

    it('should contain all modifiers', () => {
      for (const modifier of Object.keys(modifierCodes)) {
        expect((ansiCodes as Record<string, any>)[modifier]).toBeDefined();
      }
    });
  });

  describe('rgbForeground', () => {
    it('should generate correct RGB foreground code', () => {
      const code = rgbForeground(255, 0, 0);
      expect(code.open).toBe('\u001B[38;2;255;0;0m');
      expect(code.close).toBe('\u001B[39m');
    });

    it('should handle zero values', () => {
      const code = rgbForeground(0, 0, 0);
      expect(code.open).toBe('\u001B[38;2;0;0;0m');
    });

    it('should handle max values', () => {
      const code = rgbForeground(255, 255, 255);
      expect(code.open).toBe('\u001B[38;2;255;255;255m');
    });

    it('should handle mixed values', () => {
      const code = rgbForeground(100, 150, 200);
      expect(code.open).toBe('\u001B[38;2;100;150;200m');
    });
  });
});
