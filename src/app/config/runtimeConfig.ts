import { ENV_KEYS } from './envKeys';
import type { AppEnvironment, LoggingLevel } from './envKeys';

interface ProcessEnv {
  readonly env: Record<string, string | undefined>;
}

declare const process: ProcessEnv;

export interface RuntimeConfig {
  readonly appEnvironment: AppEnvironment;
  readonly apiUrl: string;
  readonly deepLinkScheme: string;
  readonly featureFlags: readonly string[];
  readonly loggingLevel: LoggingLevel;
}

export const DEFAULT_RUNTIME_CONFIG: RuntimeConfig = {
  appEnvironment: 'local',
  apiUrl: 'https://koreanjson.com',
  deepLinkScheme: 'chanqs-rn-tutorial',
  featureFlags: [],
  loggingLevel: 'debug',
};

const APP_ENVIRONMENTS = [
  'local',
  'development',
  'staging',
  'production',
] as const satisfies readonly AppEnvironment[];

const LOGGING_LEVELS = [
  'debug',
  'info',
  'warn',
  'error',
  'silent',
] as const satisfies readonly LoggingLevel[];

const readPublicEnv = (key: string): string | undefined => {
  const value = process.env[key]?.trim();

  return value !== undefined && value.length > 0 ? value : undefined;
};

const parseAppEnvironment = (
  value: string | undefined,
): AppEnvironment =>
  APP_ENVIRONMENTS.find((environment) => environment === value) ??
  DEFAULT_RUNTIME_CONFIG.appEnvironment;

const parseLoggingLevel = (value: string | undefined): LoggingLevel =>
  LOGGING_LEVELS.find((loggingLevel) => loggingLevel === value) ??
  DEFAULT_RUNTIME_CONFIG.loggingLevel;

const parseFeatureFlags = (value: string | undefined): readonly string[] => {
  if (value === undefined) {
    return DEFAULT_RUNTIME_CONFIG.featureFlags;
  }

  return value
    .split(',')
    .map((featureFlag) => featureFlag.trim())
    .filter((featureFlag) => featureFlag.length > 0);
};

export const createRuntimeConfig = (): RuntimeConfig => ({
  appEnvironment: parseAppEnvironment(readPublicEnv(ENV_KEYS.APP_ENV)),
  apiUrl: readPublicEnv(ENV_KEYS.API_URL) ?? DEFAULT_RUNTIME_CONFIG.apiUrl,
  deepLinkScheme:
    readPublicEnv(ENV_KEYS.DEEP_LINK_SCHEME) ??
    DEFAULT_RUNTIME_CONFIG.deepLinkScheme,
  featureFlags: parseFeatureFlags(readPublicEnv(ENV_KEYS.FEATURE_FLAGS)),
  loggingLevel: parseLoggingLevel(readPublicEnv(ENV_KEYS.LOGGING_LEVEL)),
});

export const runtimeConfig = createRuntimeConfig();

export const isFeatureEnabled = (
  featureFlag: string,
  config: RuntimeConfig = runtimeConfig,
): boolean => config.featureFlags.includes(featureFlag);

