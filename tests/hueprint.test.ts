import { describe, it, expect } from 'vitest';
import { createHueprint, createTheme } from '../src/index.js';

describe('Hueprint Basic Tests', () => {
  it('supports chainable styling', () => {
    const coloredHueprint = createHueprint({ enabled: true });
    const value = coloredHueprint.red.bold('Hello');
    expect(value).toBe('\u001B[31m\u001B[1mHello\u001B[22m\u001B[39m');
  });

  it('supports functional styling', () => {
    const coloredHueprint = createHueprint({ enabled: true });
    const value = coloredHueprint.style('Hello', {
      color: 'cyan',
      backgroundColor: 'bgBlack',
      underline: true,
    });

    expect(value).toBe('\u001B[36m\u001B[40m\u001B[4mHello\u001B[24m\u001B[49m\u001B[39m');
  });

  it('supports gradient text', () => {
    const value = createHueprint({ enabled: true }).gradient('AB', {
      colors: ['#ff0000', '#00ff00'],
    });

    expect(value).toBe('\u001B[38;2;255;0;0mA\u001B[39m\u001B[38;2;0;255;0mB\u001B[39m');
  });

  it('supports themed output', () => {
    const theme = createTheme({
      primary: { color: 'magenta', bold: true, prefix: '[app] ' },
    });
    const localHueprint = createHueprint({ enabled: true, theme });

    expect(localHueprint.theme('primary', 'Booted')).toBe(
      '[app] \u001B[35m\u001B[1mBooted\u001B[22m\u001B[39m',
    );
  });

  it('formats logger badges', () => {
    const localHueprint = createHueprint({ enabled: true });
    expect(localHueprint.format('success', 'Ready')).toBe(
      '\u001B[32m\u001B[1m✔ SUCCESS\u001B[22m\u001B[39m Ready',
    );
  });

  it('can disable color output', () => {
    const localHueprint = createHueprint({ enabled: false });
    expect(localHueprint.red.bold('Hello')).toBe('Hello');
  });
});
