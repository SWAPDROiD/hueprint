import { buildHueprint } from './core/builder.js';
import type { CreateHueprintOptions, HueprintInstance } from './core/types.js';

export const createHueprint = (options: CreateHueprintOptions = {}): any => {
  const terminal = buildHueprint({ ...options, target: 'terminal' });
  const html = buildHueprint({ ...options, target: 'html' });
  const object = buildHueprint({ ...options, target: 'object' });

  // Attach html and object renderers to terminal
  (terminal as any).html = html;
  (terminal as any).object = object;

  return terminal as HueprintInstance;
};
