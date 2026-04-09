import { buildHueprint } from '../core/builder.js';

/**
 * HTML rendering target for hueprint
 * Renders styled text as HTML <span> elements with inline CSS styles
 *
 * @example
 * import hueprint from 'hueprint/html';
 * const html = hueprint.red.bold('Hello World');
 * // Returns: <span style="color:#ef4444;font-weight:bold">Hello World</span>
 */
const hueprint = buildHueprint({ target: 'html' });

export default hueprint;
