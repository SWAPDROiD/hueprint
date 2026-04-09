<p align="center">
  <img src="./assets/logo.svg" width="400" alt="hueprint logo" />
</p>

<h1 align="center">hueprint</h1>

<p align="center">
  Next-gen terminal styling & developer logging toolkit
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/hueprint" alt="npm version" />
  <img src="https://img.shields.io/npm/dm/hueprint" alt="npm downloads" />
  <img src="https://img.shields.io/badge/license-MIT-0f172a" alt="MIT license" />
</p>

<p align="center">
  A production-ready TypeScript library for expressive ANSI styling, gradients, reusable themes, and developer-friendly logging.
</p>

## Features

- ANSI color styling with manual escape code handling
- Chainable API: `hueprint.red.bold('Hello')`
- Functional API: `hueprint.style('Hello', { color: 'cyan', underline: true })`
- Built-in logging helpers for success, error, warn, and info
- Hex-based gradient text support
- Theme system for reusable output patterns
- Zero runtime dependencies in the core package
- Tree-shakable exports
- ESM and CommonJS support

## ✨ Preview

<p align="center">
  <img src="./assets/sample.png" width="800" alt="hueprint playground preview" />
</p>

## Installation

```bash
npm install hueprint
```

## 🚀 Usage

```js
import hueprint from 'hueprint';

console.log(hueprint.red('Hello World'));
hueprint.success('Server started');
hueprint.error('Something failed');
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

## API

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

## 🌐 Live Playground

GitHub README rendering does not fully support raw browser-style HTML previews, so the interactive playground should be opened locally.

```bash
open playground/index.html
```

If you deploy docs later, you can link the hosted playground here:

```txt
https://YOUR_USERNAME.github.io/hueprint
```

## Development

```bash
npm install
npm run build
npm run test
npm run typecheck
```
