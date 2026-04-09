import type { NamedBackgroundColor, NamedColor } from '../core/types.js';

export const foregroundColors = [
  'black',
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'white',
  'gray',
] as const satisfies readonly NamedColor[];

export const backgroundColors = [
  'bgBlack',
  'bgRed',
  'bgGreen',
  'bgYellow',
  'bgBlue',
  'bgMagenta',
  'bgCyan',
  'bgWhite',
  'bgGray',
] as const satisfies readonly NamedBackgroundColor[];
