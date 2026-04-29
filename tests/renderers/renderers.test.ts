import { describe, it, expect } from 'vitest';
import { renderTerminal } from '../../src/renderers/terminal';
import { renderHTML } from '../../src/renderers/html';
import { renderObject } from '../../src/renderers/object';

describe('Terminal Renderer', () => {
  it('should return text unchanged for empty styles', () => {
    expect(renderTerminal('Hello', [])).toBe('Hello');
  });

  it('should apply single color style', () => {
    expect(renderTerminal('Hello', ['red'])).toBe('\u001B[31mHello\u001B[39m');
  });

  it('should apply single modifier', () => {
    expect(renderTerminal('Hello', ['bold'])).toBe('\u001B[1mHello\u001B[22m');
  });

  it('should apply multiple styles', () => {
    const result = renderTerminal('Hello', ['red', 'bold']);
    expect(result).toContain('Hello');
    expect(result).toContain('\u001B[31m');
    expect(result).toContain('\u001B[1m');
  });

  it('should deduplicate styles', () => {
    const result = renderTerminal('Hello', ['red', 'red', 'bold'] as any);
    expect(result).toBe('\u001B[31m\u001B[1mHello\u001B[22m\u001B[39m');
  });

  it('should handle background colors', () => {
    const result = renderTerminal('Hello', ['bgBlue']);
    expect(result).toContain('\u001B[44m');
    expect(result).toContain('\u001B[49m');
  });
});

describe('HTML Renderer', () => {
  it('should return text unchanged for empty styles', () => {
    expect(renderHTML('Hello', [])).toBe('Hello');
  });

  it('should apply red color', () => {
    const result = renderHTML('Hello', ['red']);
    expect(result).toContain('Hello');
    expect(result).toContain('style=');
    expect(result).toContain('color');
  });

  it('should apply background color', () => {
    const result = renderHTML('Hello', ['bgGreen']);
    expect(result).toContain('Hello');
    expect(result).toContain('background-color');
  });

  it('should apply bold modifier', () => {
    const result = renderHTML('Hello', ['bold']);
    expect(result).toContain('Hello');
    expect(result).toContain('font-weight:bold');
  });

  it('should apply italic modifier', () => {
    const result = renderHTML('Hello', ['italic']);
    expect(result).toContain('font-style:italic');
  });

  it('should apply underline modifier', () => {
    const result = renderHTML('Hello', ['underline']);
    expect(result).toContain('text-decoration:underline');
  });

  it('should apply dim modifier', () => {
    const result = renderHTML('Hello', ['dim']);
    expect(result).toContain('opacity:0.5');
  });

  it('should apply strikethrough modifier', () => {
    const result = renderHTML('Hello', ['strikethrough']);
    expect(result).toContain('text-decoration:line-through');
  });

  it('should apply inverse modifier', () => {
    const result = renderHTML('Hello', ['inverse']);
    expect(result).toContain('filter:invert(1)');
  });

  it('should combine multiple styles', () => {
    const result = renderHTML('Hello', ['red', 'bold', 'bgYellow']);
    expect(result).toContain('Hello');
    expect(result).toContain('color');
    expect(result).toContain('background-color');
    expect(result).toContain('font-weight:bold');
  });

  it('should wrap text in span with style attribute', () => {
    const result = renderHTML('Hello', ['red']);
    expect(result).toMatch(/<span style="[^"]*">/);
    expect(result).toMatch(/<\/span>/);
  });

  it('should handle all foreground colors', () => {
    const colors = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray'];
    for (const color of colors) {
      const result = renderHTML('Test', [color as any]);
      expect(result).toContain('color');
    }
  });

  it('should handle all background colors', () => {
    const colors = ['bgBlack', 'bgRed', 'bgGreen', 'bgYellow', 'bgBlue', 'bgMagenta', 'bgCyan', 'bgWhite', 'bgGray'];
    for (const color of colors) {
      const result = renderHTML('Test', [color as any]);
      expect(result).toContain('background-color');
    }
  });
});

describe('Object Renderer', () => {
  it('should return object with empty style for no styles', () => {
    const result = renderObject('Hello', []);
    expect(result).toEqual({ text: 'Hello', style: {} });
  });

  it('should apply color as RGB value', () => {
    const result = renderObject('Hello', ['red']);
    expect(result.text).toBe('Hello');
    expect(result.style.color).toBe('#ef4444');
  });

  it('should apply background color', () => {
    const result = renderObject('Hello', ['bgBlue']);
    expect(result.text).toBe('Hello');
    expect(result.style.backgroundColor).toBe('#3b82f6');
  });

  it('should apply bold modifier', () => {
    const result = renderObject('Hello', ['bold']);
    expect(result.style.fontWeight).toBe('bold');
  });

  it('should apply italic modifier', () => {
    const result = renderObject('Hello', ['italic']);
    expect(result.style.fontStyle).toBe('italic');
  });

  it('should apply underline modifier', () => {
    const result = renderObject('Hello', ['underline']);
    expect(result.style.textDecoration).toBe('underline');
  });

  it('should apply dim modifier', () => {
    const result = renderObject('Hello', ['dim']);
    expect(result.style.opacity).toBe(0.5);
  });

  it('should apply strikethrough modifier', () => {
    const result = renderObject('Hello', ['strikethrough']);
    expect(result.style.textDecoration).toBe('line-through');
  });

  it('should apply inverse modifier', () => {
    const result = renderObject('Hello', ['inverse']);
    expect(result.style.filter).toBe('invert(1)');
  });

  it('should combine multiple styles', () => {
    const result = renderObject('Hello', ['green', 'bold', 'bgYellow']);
    expect(result.text).toBe('Hello');
    expect(result.style.color).toBe('#10b981');
    expect(result.style.backgroundColor).toBe('#f59e0b');
    expect(result.style.fontWeight).toBe('bold');
  });

  it('should handle all foreground colors', () => {
    const colors = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray'];
    for (const color of colors) {
      const result = renderObject('Test', [color as any]);
      expect(result.style.color).toBeDefined();
      expect(result.style.color).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('should handle all background colors', () => {
    const colors = ['bgBlack', 'bgRed', 'bgGreen', 'bgYellow', 'bgBlue', 'bgMagenta', 'bgCyan', 'bgWhite', 'bgGray'];
    for (const color of colors) {
      const result = renderObject('Test', [color as any]);
      expect(result.style.backgroundColor).toBeDefined();
      expect(result.style.backgroundColor).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});
