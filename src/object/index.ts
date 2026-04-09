import { buildHueprint } from '../core/builder.js';

/**
 * Object rendering target for hueprint
 * Renders styled text as framework-agnostic style objects
 * Perfect for React, Angular, Vue, and other UI frameworks
 *
 * @example
 * import hueprint from 'hueprint/object';
 * const { text, style } = hueprint.red.bold('Hello World');
 * // React: <span style={style}>{text}</span>
 * // Angular: <span [ngStyle]="style">{{ text }}</span>
 * // Vue: <span :style="style">{{ text }}</span>
 */
const hueprint = buildHueprint({ target: 'object' });

export default hueprint;
