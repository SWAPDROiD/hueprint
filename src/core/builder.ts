import { ansiCodes } from './ansi.js';
import type {
  ChainInstance,
  CreateHueprintOptions,
  GradientOptions,
  HueprintInstance,
  LogLevel,
  LoggerOptions,
  RenderTarget,
  StyleName,
  StyleOptions,
  ThemeAccessor,
  ThemeDefinition,
} from './types.js';
import { dedupeStyles, normalizeStyleOptions, supportsColor, toText } from './utils.js';
import { foregroundColors, backgroundColors } from '../styles/colors.js';
import { modifiers } from '../styles/modifiers.js';
import { applyGradient } from '../gradient/gradient.js';
import { formatLogMessage } from '../logger/logger.js';
import { resolveThemeEntry } from '../theme/theme.js';
import { renderTerminal } from '../renderers/terminal.js';
import { renderHTML } from '../renderers/html.js';
import { renderObject } from '../renderers/object.js';
import type { StyledObject } from '../renderers/object.js';

const styleProperties = [...foregroundColors, ...backgroundColors, ...modifiers] as const;

const createRenderer = (target: RenderTarget) => {
  const renderFn = (text: string, styles: readonly StyleName[]): string | StyledObject => {
    if (target === 'html') {
      return renderHTML(text, styles);
    }

    if (target === 'object') {
      return renderObject(text, styles);
    }

    return renderTerminal(text, styles);
  };

  return renderFn;
};

const createThemeAccessor = (
  makeChain: (styles: readonly StyleName[]) => HueprintInstance,
  theme: ThemeDefinition,
  applyTheme: (name: string, input: unknown) => string,
): ThemeAccessor =>
  new Proxy(
    {},
    {
      get(_target, property) {
        if (typeof property !== 'string') {
          return undefined;
        }

        if (!(property in theme)) {
          return undefined;
        }

        const entry = resolveThemeEntry(theme, property);
        const chain = makeChain(normalizeStyleOptions(entry));

        return new Proxy(((input: unknown) => applyTheme(property, input)) as ChainInstance, {
          get(_innerTarget, innerProperty) {
            return Reflect.get(chain, innerProperty);
          },
          apply(_innerTarget, _thisArg, argumentsList) {
            return applyTheme(property, argumentsList[0]);
          },
        });
      },
    },
  ) as ThemeAccessor;

export const buildHueprint = (options: CreateHueprintOptions = {}): HueprintInstance => {
  const enabled = supportsColor(options.enabled);
  const theme = options.theme ?? {};
  const loggerOptions = options.logger;
  const target = options.target ?? 'terminal';
  const renderer = createRenderer(target);

  const styleText = (input: unknown, styleOptions: StyleOptions): any => {
    const text = toText(input);
    const styles = normalizeStyleOptions(styleOptions);
    
    if (!enabled) {
      return target === 'object' ? { text, style: {} } : text;
    }

    return renderer(text, styles);
  };

  const gradientText = (input: unknown, gradientOptions: GradientOptions): any =>
    applyGradient(input, gradientOptions, enabled);

  const themeText = (name: string, input: unknown): any => {
    const entry = resolveThemeEntry(theme, name);
    const core = styleText(input, entry);
    const styledText = target === 'object' ? (core as StyledObject).text : (core as string);
    return target === 'object' 
      ? { text: `${entry.prefix ?? ''}${styledText}${entry.suffix ?? ''}`, style: (core as StyledObject).style } 
      : `${entry.prefix ?? ''}${core}${entry.suffix ?? ''}`;
  };

  const format = (level: LogLevel, ...input: unknown[]): any =>
    formatLogMessage(level, loggerOptions, styleText, ...input);

  const createLogHelpers = (overrides?: LoggerOptions) => ({
    success: (...input: unknown[]) => console.log(formatLogMessage('success', overrides ?? loggerOptions, styleText, ...input)),
    error: (...input: unknown[]) => console.error(formatLogMessage('error', overrides ?? loggerOptions, styleText, ...input)),
    warn: (...input: unknown[]) => console.warn(formatLogMessage('warn', overrides ?? loggerOptions, styleText, ...input)),
    info: (...input: unknown[]) => console.info(formatLogMessage('info', overrides ?? loggerOptions, styleText, ...input)),
  });

  const makeChain = (styles: readonly StyleName[]): HueprintInstance =>
    new Proxy(((input: unknown) => {
      const text = toText(input);
      if (!enabled) {
        return target === 'object' ? { text, style: {} } : text;
      }
      return renderer(text, styles);
    }) as HueprintInstance, {
      get(_target, property) {
        if (property === 'style') {
          return styleText;
        }

        if (property === 'gradient') {
          return gradientText;
        }

        if (property === 'theme') {
          return themeText;
        }

        if (property === 'withTheme') {
          return (nextTheme: ThemeDefinition) => {
            const nextOptions: CreateHueprintOptions = {
              ...options,
              enabled,
              theme: nextTheme,
              target,
            };

            if (loggerOptions) {
              nextOptions.logger = loggerOptions;
            }

            return buildHueprint(nextOptions);
          };
        }

        if (property === 'format') {
          return format;
        }

        if (property === 'createLogger') {
          return createLogHelpers;
        }

        if (property === 'log') {
          return createLogHelpers(loggerOptions);
        }

        if (property === 'themed') {
          return createThemeAccessor(makeChain, theme, themeText);
        }

        if (typeof property === 'string' && styleProperties.includes(property as (typeof styleProperties)[number])) {
          return makeChain([...styles, property as StyleName]);
        }

        return Reflect.get(_target, property);
      },
      apply(_target, _thisArg, argumentsList) {
        const text = toText(argumentsList[0]);
        if (!enabled) {
          return target === 'object' ? { text, style: {} } : text;
        }
        return renderer(text, styles);
      },
    });

  const root = makeChain([]);

  Object.assign(root, {
    success: (...input: unknown[]) => format('success', ...input),
    error: (...input: unknown[]) => format('error', ...input),
    warn: (...input: unknown[]) => format('warn', ...input),
    info: (...input: unknown[]) => format('info', ...input),
  });

  return root;
};
