<p align="center">
  <img src="https://raw.githubusercontent.com/SWAPDROiD/hueprint/main/assets/logo.svg" width="400" alt="hueprint logo" />
</p>

<h1 align="center">hueprint</h1>

<p align="center">
  Universal terminal and web styling toolkit for Node.js
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/hueprint" alt="npm version" />
  <img src="https://img.shields.io/npm/dm/hueprint" alt="npm downloads" />
  <img src="https://img.shields.io/badge/license-MIT-0f172a" alt="MIT license" />
</p>

<p align="center">
  ANSI colors, HTML rendering, style objects, gradients, theming, and developer-friendly logging for modern JavaScript and TypeScript.
</p>

`hueprint` is a universal styling and logging toolkit for Node.js, designed to create expressive output across multiple targets: terminals (ANSI), web (HTML), and UI frameworks (style objects).

It combines a chainable styling API, a functional styling API, gradient text, reusable themes, and built-in logging helpers in a lightweight package built for developer tools, CLIs, scripts, and Node.js applications.

## ✨ Preview

<p align="center">
  <img src="https://raw.githubusercontent.com/SWAPDROiD/hueprint/main/assets/sample-1.png" width="800" alt="hueprint preview" />
  <img src="https://raw.githubusercontent.com/SWAPDROiD/hueprint/main/assets/sample-2.png" width="800" alt="hueprint preview" />
</p>

## Features

- **Universal rendering engine** - Terminal (ANSI), HTML, and framework-agnostic style objects
- ANSI color styling with manual escape code handling
- Chainable API for expressive styling
- Functional API for object-based styling
- HTML output for web rendering and browser environments
- Framework-friendly style objects for React, Angular, Vue, and more
- Gradient text support for richer terminal and web presentation
- Built-in logging helpers for success, error, warn, and info
- Theme system for reusable output patterns
- Zero runtime dependencies in the core package
- High performance and tree-shakable exports
- ESM and CommonJS support for modern Node.js projects

## Installation

```bash
npm install hueprint
```

## 🚀 Usage

```js
import hueprint from 'hueprint';

console.log(hueprint.red('Hello World'));
hueprint.log.success('Server started');
hueprint.log.error('Something failed');

console.log(
  hueprint.gradient('Loading...', {
    colors: ['#ef4444', '#f59e0b'],
  }),
);
```

## Quick Start

```ts
import hueprint, { createHueprint, createTheme } from 'hueprint';

console.log(hueprint.red.bold('Hello World'));

console.log(
  hueprint.style('Configurable', {
    color: 'cyan',
    backgroundColor: 'bgBlack',
    underline: true,
  }),
);

console.log(
  hueprint.gradient('Gradient', {
    colors: ['#ef4444', '#f59e0b', '#10b981'],
  }),
);

const theme = createTheme({
  primary: { color: 'blue', bold: true },
  success: { color: 'green', bold: true, prefix: '[ok] ' },
});

const hp = createHueprint({ theme });

console.log(hp.theme('success', 'Deployed'));
console.log(hp.format('info', 'Server listening on port 3000'));
hp.log.success('Saved settings');
```

## 🌐 Universal Rendering

hueprint supports multiple output formats, allowing you to use the same API across different environments:

### Terminal (Default)

```ts
import hueprint from 'hueprint';

console.log(hueprint.red.bold('Hello Terminal'));
// Output: Red bold text in terminal
```

### HTML Output

```ts
import hueprint from 'hueprint/html';

const html = hueprint.red.bold('Hello Web');
// Output: <span style="color:#ef4444;font-weight:bold">Hello Web</span>

document.body.innerHTML = html;
```

Or use on the default instance:

```ts
import hueprint from 'hueprint';

const html = hueprint.html.red.bold('Hello Web');
document.body.innerHTML = html;
```

### Style Objects (React, Angular, Vue)

```ts
import hueprint from 'hueprint/object';

const { text, style } = hueprint.red.bold('Hello UI');
// Returns: { text: 'Hello UI', style: { color: '#ef4444', fontWeight: 'bold' } }
```

**React:**
```tsx
<span style={style}>{text}</span>
```

**Angular:**
```html
<span [ngStyle]="style">{{ text }}</span>
```

**Vue:**
```vue
<span :style="style">{{ text }}</span>
```

Or use on the default instance:

```ts
import hueprint from 'hueprint';

const { text, style } = hueprint.object.red.bold('Hello UI');
```

## API Highlights

### Chainable styling

```ts
hueprint.red.bold('Hello World');
hueprint.bgBlue.white.underline('Readable contrast');
```

### Functional styling

```ts
hueprint.style('Configurable text', {
  color: 'magenta',
  bold: true,
  italic: true,
});
```

### Logging helpers

```ts
hueprint.format('success', 'Build completed');
hueprint.log.error('Could not connect');

const log = createHueprint({
  logger: {
    info: {
      prefix: 'i',
      label: 'NOTICE',
      style: { color: 'cyan', bold: true },
    },
  },
});

log.log.info('Custom badge');
```

### Themes

```ts
const theme = createTheme({
  primary: { color: 'cyan', bold: true },
  danger: { color: 'red', bold: true, prefix: '!! ' },
});

const hp = createHueprint({ theme });

hp.theme('primary', 'Reusable style');
hp.theme('danger', 'Something failed');
```

### Tree-shakable modules

```ts
import { applyGradient } from 'hueprint/gradient';
import { createTheme } from 'hueprint/theme';
import { normalizeStyleOptions } from 'hueprint/core';
```

## Why Use hueprint?

`hueprint` is built for developers who want consistent styling across terminal, web, and UI frameworks. It provides a universal styling engine that works seamlessly whether you're building CLI tools, server-side rendering, or interactive applications. With a single API, you can create expressive output for any environment—terminal (ANSI), browsers (HTML), or web frameworks (style objects).

## Best Terminal Styling for Node.js

`hueprint` provides a complete solution for terminal styling and logging in Node.js applications. With a clean API, strong TypeScript support, and flexible styling options, it enables developers to build polished CLI experiences with minimal effort.

## HTML and CSS Styling for Web

`hueprint` generates clean HTML with inline CSS styles for web browsers, making it easy to create styled components without writing CSS. Perfect for server-side rendering, email templates, and dynamic UI generation.

## Framework-Agnostic Style Objects

`hueprint` returns framework-friendly style objects that work seamlessly with React, Angular, Vue, and other UI frameworks. No framework lock-in—just simple JSON-compatible objects.

## 🌐 Playground

The browser playground provides a visual preview of hueprint-inspired colors, modifiers, custom styles, and gradient text. GitHub README rendering does not fully support raw browser-style HTML previews, so the interactive demo should be opened locally.

```bash
cd playground
open index.html
```

## Development

```bash
npm install
npm run build
npm run test
npm run typecheck
```
