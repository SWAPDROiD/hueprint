import type { StyleName } from '../core/types.js';
import { foregroundColors, backgroundColors } from '../styles/colors.js';
import { modifiers } from '../styles/modifiers.js';

const colorMap: Record<string, string> = {
  black: '#000000',
  red: '#ef4444',
  green: '#10b981',
  yellow: '#f59e0b',
  blue: '#3b82f6',
  magenta: '#d946ef',
  cyan: '#06b6d4',
  white: '#ffffff',
  gray: '#6b7280',
};

const bgColorMap: Record<string, string> = {
  bgBlack: '#000000',
  bgRed: '#ef4444',
  bgGreen: '#10b981',
  bgYellow: '#f59e0b',
  bgBlue: '#3b82f6',
  bgMagenta: '#d946ef',
  bgCyan: '#06b6d4',
  bgWhite: '#ffffff',
  bgGray: '#6b7280',
};

export const renderHTML = (text: string, styles: readonly StyleName[]): string => {
  if (styles.length === 0) {
    return text;
  }

  const cssProps: string[] = [];

  for (const style of styles) {
    if (foregroundColors.includes(style as any)) {
      cssProps.push(`color:${colorMap[style] || style}`);
    }

    if (backgroundColors.includes(style as any)) {
      const bgColor = style.replace(/^bg/, '');
      cssProps.push(`background-color:${bgColorMap[style] || bgColor}`);
    }

    if (style === 'bold') {
      cssProps.push('font-weight:bold');
    }

    if (style === 'dim') {
      cssProps.push('opacity:0.5');
    }

    if (style === 'italic') {
      cssProps.push('font-style:italic');
    }

    if (style === 'underline') {
      cssProps.push('text-decoration:underline');
    }

    if (style === 'strikethrough') {
      cssProps.push('text-decoration:line-through');
    }

    if (style === 'inverse') {
      cssProps.push('filter:invert(1)');
    }
  }

  const css = cssProps.join(';');
  return `<span style="${css}">${text}</span>`;
};
