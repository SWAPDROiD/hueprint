export { createHueprint } from './createHueprint.js';
export { createTheme } from './theme/theme.js';
export { foregroundColors, backgroundColors } from './styles/colors.js';
export { modifiers } from './styles/modifiers.js';
export type {
  CreateHueprintOptions,
  GradientOptions,
  HueprintInstance,
  LoggerOptions,
  StyleOptions,
  ThemeDefinition,
  ThemeEntry,
} from './core/types.js';

import { createHueprint } from './createHueprint.js';

const hueprint = createHueprint();

export default hueprint;
