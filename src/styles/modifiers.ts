import type { ModifierName } from '../core/types.js';

export const modifiers = [
  'bold',
  'dim',
  'italic',
  'underline',
  'inverse',
  'hidden',
  'strikethrough',
] as const satisfies readonly ModifierName[];
