import test from 'node:test';
import assert from 'node:assert/strict';
import { createHueprint, createTheme } from '../src/index.js';

const coloredHueprint = createHueprint({ enabled: true });

test('supports chainable styling', () => {
  const value = coloredHueprint.red.bold('Hello');
  assert.equal(value, '\u001B[31m\u001B[1mHello\u001B[22m\u001B[39m');
});

test('supports functional styling', () => {
  const value = coloredHueprint.style('Hello', {
    color: 'cyan',
    backgroundColor: 'bgBlack',
    underline: true,
  });

  assert.equal(value, '\u001B[36m\u001B[40m\u001B[4mHello\u001B[24m\u001B[49m\u001B[39m');
});

test('supports gradient text', () => {
  const value = createHueprint({ enabled: true }).gradient('AB', {
    colors: ['#ff0000', '#00ff00'],
  });

  assert.equal(value, '\u001B[38;2;255;0;0mA\u001B[39m\u001B[38;2;0;255;0mB\u001B[39m');
});

test('supports themed output', () => {
  const theme = createTheme({
    primary: { color: 'magenta', bold: true, prefix: '[app] ' },
  });
  const localHueprint = createHueprint({ enabled: true, theme });

  assert.equal(
    localHueprint.theme('primary', 'Booted'),
    '[app] \u001B[35m\u001B[1mBooted\u001B[22m\u001B[39m',
  );
});

test('formats logger badges', () => {
  const localHueprint = createHueprint({ enabled: true });
  assert.equal(
    localHueprint.format('success', 'Ready'),
    '\u001B[32m\u001B[1m✔ SUCCESS\u001B[22m\u001B[39m Ready',
  );
});

test('can disable color output', () => {
  const localHueprint = createHueprint({ enabled: false });
  assert.equal(localHueprint.red.bold('Hello'), 'Hello');
});
