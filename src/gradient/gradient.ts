import { rgbForeground } from '../core/ansi.js';
import { toText } from '../core/utils.js';
import type { GradientOptions } from '../core/types.js';

interface Rgb {
  red: number;
  green: number;
  blue: number;
}

const clamp = (value: number): number => Math.max(0, Math.min(255, Math.round(value)));

const parseHexColor = (value: string): Rgb => {
  const normalized = value.replace('#', '').trim();
  const sixDigit =
    normalized.length === 3
      ? normalized
          .split('')
          .map((part) => part + part)
          .join('')
      : normalized;

  if (!/^[\da-fA-F]{6}$/.test(sixDigit)) {
    throw new Error(`Invalid gradient color: "${value}"`);
  }

  return {
    red: Number.parseInt(sixDigit.slice(0, 2), 16),
    green: Number.parseInt(sixDigit.slice(2, 4), 16),
    blue: Number.parseInt(sixDigit.slice(4, 6), 16),
  };
};

const interpolate = (start: Rgb, end: Rgb, factor: number): Rgb => ({
  red: clamp(start.red + (end.red - start.red) * factor),
  green: clamp(start.green + (end.green - start.green) * factor),
  blue: clamp(start.blue + (end.blue - start.blue) * factor),
});

const colorForIndex = (palette: Rgb[], index: number, length: number): Rgb => {
  if (palette.length === 1 || length <= 1) {
    return palette[0] as Rgb;
  }

  const position = index / (length - 1);
  const segmentSize = 1 / (palette.length - 1);
  const segmentIndex = Math.min(Math.floor(position / segmentSize), palette.length - 2);
  const segmentStart = segmentIndex * segmentSize;
  const factor = (position - segmentStart) / segmentSize;

  return interpolate(palette[segmentIndex] as Rgb, palette[segmentIndex + 1] as Rgb, factor);
};

export const applyGradient = (input: unknown, options: GradientOptions, enabled: boolean): string => {
  const text = toText(input);

  if (!enabled || text.length === 0) {
    return text;
  }

  if (options.colors.length === 0) {
    throw new Error('Gradient requires at least one color.');
  }

  const palette = options.colors.map(parseHexColor);

  return Array.from(text)
    .map((character, index, chars) => {
      if (character === '\n') {
        return character;
      }

      const { red, green, blue } = colorForIndex(palette, index, chars.length);
      const code = rgbForeground(red, green, blue);
      return `${code.open}${character}${code.close}`;
    })
    .join('');
};
