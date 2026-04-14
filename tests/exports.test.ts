import { describe, it, expect } from 'vitest';

describe('Type Exports', () => {
  it('should export types from their respective modules', async () => {
    // Import the main index to verify all exports are present
    const module = await import('../src/index.js');

    expect(module).toBeDefined();
    expect(module.createHueprint).toBeDefined();
    expect(module.createTheme).toBeDefined();
    expect(module.foregroundColors).toBeDefined();
    expect(module.backgroundColors).toBeDefined();
    expect(module.modifiers).toBeDefined();
  });

  it('should export core types from core/index', async () => {
    const coreModule = await import('../src/core/index.js');

    expect(coreModule.buildHueprint).toBeDefined();
    expect(coreModule.ansiCodes).toBeDefined();
    expect(coreModule.colorCodes).toBeDefined();
    expect(coreModule.backgroundColorCodes).toBeDefined();
    expect(coreModule.modifierCodes).toBeDefined();
    expect(coreModule.rgbForeground).toBeDefined();
    expect(coreModule.toText).toBeDefined();
    expect(coreModule.normalizeStyleOptions).toBeDefined();
    expect(coreModule.dedupeStyles).toBeDefined();
    expect(coreModule.supportsColor).toBeDefined();
  });

  it('should export gradient types', async () => {
    const gradientModule = await import('../src/gradient/index.js');
    expect(gradientModule.applyGradient).toBeDefined();
  });

  it('should export logger types', async () => {
    const loggerModule = await import('../src/logger/index.js');
    expect(loggerModule).toBeDefined();
  });

  it('should export theme types', async () => {
    const themeModule = await import('../src/theme/index.js');
    expect(themeModule.createTheme).toBeDefined();
    expect(themeModule.resolveThemeEntry).toBeDefined();
  });

  it('should export HTML target', async () => {
    const htmlModule = await import('../src/html/index.js');
    expect(htmlModule.default).toBeDefined();
    expect(typeof htmlModule.default).toBe('function');
  });

  it('should export Object target', async () => {
    const objectModule = await import('../src/object/index.js');
    expect(objectModule.default).toBeDefined();
    expect(typeof objectModule.default).toBe('function');
  });
});
