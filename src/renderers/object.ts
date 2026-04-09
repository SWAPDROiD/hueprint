import type { StyleName } from '../core/types.js';
import { foregroundColors, backgroundColors } from '../styles/colors.js';

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

export interface StyledObject {
  text: string;
  style: Record<string, any>;
}

export const renderObject = (text: string, styles: readonly StyleName[]): StyledObject => {
  const style: Record<string, any> = {};

  for (const styleItem of styles) {
    if (foregroundColors.includes(styleItem as any)) {
      style.color = colorMap[styleItem] || styleItem;
    }

    if (backgroundColors.includes(styleItem as any)) {
      style.backgroundColor = bgColorMap[styleItem] || styleItem;
    }

    if (styleItem === 'bold') {
      style.fontWeight = 'bold';
    }

    if (styleItem === 'dim') {
      style.opacity = 0.5;
    }

    if (styleItem === 'italic') {
      style.fontStyle = 'italic';
    }

    if (styleItem === 'underline') {
      style.textDecoration = 'underline';
    }

    if (styleItem === 'strikethrough') {
      style.textDecoration = 'line-through';
    }

    if (styleItem === 'inverse') {
      style.filter = 'invert(1)';
    }
  }

  return { text, style };
};
