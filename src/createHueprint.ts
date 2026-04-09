import { buildHueprint } from './core/builder.js';
import type { CreateHueprintOptions, HueprintInstance } from './core/types.js';

export const createHueprint = (options: CreateHueprintOptions = {}): HueprintInstance =>
  buildHueprint(options);
