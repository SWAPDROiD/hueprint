import { ansiCodes } from '../core/ansi.js';
import type { StyleName } from '../core/types.js';
import { dedupeStyles } from '../core/utils.js';

export const renderTerminal = (text: string, styles: readonly StyleName[]): string => {
  if (styles.length === 0) {
    return text;
  }

  const resolved = dedupeStyles(styles);
  const opens = resolved.map((style) => ansiCodes[style].open).join('');
  const closes = [...resolved].reverse().map((style) => ansiCodes[style].close).join('');
  return `${opens}${text}${closes}`;
};
