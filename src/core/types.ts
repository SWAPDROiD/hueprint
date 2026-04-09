export type NamedColor =
  | 'black'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white'
  | 'gray';

export type NamedBackgroundColor =
  | 'bgBlack'
  | 'bgRed'
  | 'bgGreen'
  | 'bgYellow'
  | 'bgBlue'
  | 'bgMagenta'
  | 'bgCyan'
  | 'bgWhite'
  | 'bgGray';

export type ModifierName =
  | 'bold'
  | 'dim'
  | 'italic'
  | 'underline'
  | 'inverse'
  | 'hidden'
  | 'strikethrough';

export type StyleName = NamedColor | NamedBackgroundColor | ModifierName;

export interface AnsiCode {
  open: string;
  close: string;
}

export interface StyleOptions {
  color?: NamedColor;
  backgroundColor?: NamedBackgroundColor;
  bold?: boolean;
  dim?: boolean;
  italic?: boolean;
  underline?: boolean;
  inverse?: boolean;
  hidden?: boolean;
  strikethrough?: boolean;
}

export interface ThemeEntry extends StyleOptions {
  prefix?: string;
  suffix?: string;
}

export type ThemeDefinition = Record<string, ThemeEntry>;

export interface LoggerLevelOptions {
  label?: string;
  prefix?: string;
  style?: StyleOptions;
}

export interface LoggerOptions {
  success?: LoggerLevelOptions;
  error?: LoggerLevelOptions;
  warn?: LoggerLevelOptions;
  info?: LoggerLevelOptions;
}

export interface GradientOptions {
  colors: string[];
}

export type RenderTarget = 'terminal' | 'html' | 'object';

export interface CreateHueprintOptions {
  enabled?: boolean;
  theme?: ThemeDefinition;
  logger?: LoggerOptions;
  target?: RenderTarget;
}

export type LogLevel = 'success' | 'error' | 'warn' | 'info';

export interface ChainInstance {
  (input: unknown): string;
}

export type ThemeAccessor = Record<string, ChainInstance>;

export interface LogHelpers {
  success: (...input: unknown[]) => void;
  error: (...input: unknown[]) => void;
  warn: (...input: unknown[]) => void;
  info: (...input: unknown[]) => void;
}

export interface HueprintInstance extends ChainInstance {
  readonly black: HueprintInstance;
  readonly red: HueprintInstance;
  readonly green: HueprintInstance;
  readonly yellow: HueprintInstance;
  readonly blue: HueprintInstance;
  readonly magenta: HueprintInstance;
  readonly cyan: HueprintInstance;
  readonly white: HueprintInstance;
  readonly gray: HueprintInstance;
  readonly bgBlack: HueprintInstance;
  readonly bgRed: HueprintInstance;
  readonly bgGreen: HueprintInstance;
  readonly bgYellow: HueprintInstance;
  readonly bgBlue: HueprintInstance;
  readonly bgMagenta: HueprintInstance;
  readonly bgCyan: HueprintInstance;
  readonly bgWhite: HueprintInstance;
  readonly bgGray: HueprintInstance;
  readonly bold: HueprintInstance;
  readonly dim: HueprintInstance;
  readonly italic: HueprintInstance;
  readonly underline: HueprintInstance;
  readonly inverse: HueprintInstance;
  readonly hidden: HueprintInstance;
  readonly strikethrough: HueprintInstance;
  readonly themed: ThemeAccessor;
  readonly log: LogHelpers;
  success: (...input: unknown[]) => string;
  error: (...input: unknown[]) => string;
  warn: (...input: unknown[]) => string;
  info: (...input: unknown[]) => string;
  style: (input: unknown, options: StyleOptions) => string;
  gradient: (input: unknown, options: GradientOptions) => string;
  theme: (name: string, input: unknown) => string;
  format: (level: LogLevel, ...input: unknown[]) => string;
  withTheme: (theme: ThemeDefinition) => HueprintInstance;
  createLogger: (options?: LoggerOptions) => LogHelpers;
}

export interface StyledObject {
  text: string;
  style: Record<string, any>;
}
