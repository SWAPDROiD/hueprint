import type {
  AnsiCode,
  ModifierName,
  NamedBackgroundColor,
  NamedColor,
  StyleName,
} from './types.js';

const ESC = '\u001B[';

const createAnsi = (open: number, close: number): AnsiCode => ({
  open: `${ESC}${open}m`,
  close: `${ESC}${close}m`,
});

export const colorCodes: Record<NamedColor, AnsiCode> = {
  black: createAnsi(30, 39),
  red: createAnsi(31, 39),
  green: createAnsi(32, 39),
  yellow: createAnsi(33, 39),
  blue: createAnsi(34, 39),
  magenta: createAnsi(35, 39),
  cyan: createAnsi(36, 39),
  white: createAnsi(37, 39),
  gray: createAnsi(90, 39),
};

export const backgroundColorCodes: Record<NamedBackgroundColor, AnsiCode> = {
  bgBlack: createAnsi(40, 49),
  bgRed: createAnsi(41, 49),
  bgGreen: createAnsi(42, 49),
  bgYellow: createAnsi(43, 49),
  bgBlue: createAnsi(44, 49),
  bgMagenta: createAnsi(45, 49),
  bgCyan: createAnsi(46, 49),
  bgWhite: createAnsi(47, 49),
  bgGray: createAnsi(100, 49),
};

export const modifierCodes: Record<ModifierName, AnsiCode> = {
  bold: createAnsi(1, 22),
  dim: createAnsi(2, 22),
  italic: createAnsi(3, 23),
  underline: createAnsi(4, 24),
  inverse: createAnsi(7, 27),
  hidden: createAnsi(8, 28),
  strikethrough: createAnsi(9, 29),
};

export const ansiCodes: Record<StyleName, AnsiCode> = {
  ...colorCodes,
  ...backgroundColorCodes,
  ...modifierCodes,
};

export const rgbForeground = (red: number, green: number, blue: number): AnsiCode => ({
  open: `${ESC}38;2;${red};${green};${blue}m`,
  close: `${ESC}39m`,
});
