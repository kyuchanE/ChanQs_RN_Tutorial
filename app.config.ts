import type { ConfigContext, ExpoConfig } from 'expo/config';

declare const process: {
  readonly env: Record<string, string | undefined>;
};

type AppEnvironment = 'local' | 'development' | 'staging' | 'production';

type LoggingLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

interface RuntimeConfigExtra {
  readonly appEnvironment: AppEnvironment;
  readonly apiUrl: string;
  readonly deepLinkScheme: string;
  readonly featureFlags: readonly string[];
  readonly loggingLevel: LoggingLevel;
}

const DEFAULT_API_URL = 'https://koreanjson.com';

const DEFAULT_DEEP_LINK_SCHEME = 'chanqs-rn-tutorial';

const DEFAULT_APP_ENVIRONMENT: AppEnvironment = 'local';

const DEFAULT_LOGGING_LEVEL: LoggingLevel = 'debug';

const ENV_KEYS = {
  APP_ENV: 'EXPO_PUBLIC_APP_ENV',
  API_URL: 'EXPO_PUBLIC_API_URL',
  DEEP_LINK_SCHEME: 'EXPO_PUBLIC_DEEP_LINK_SCHEME',
  FEATURE_FLAGS: 'EXPO_PUBLIC_FEATURE_FLAGS',
  LOGGING_LEVEL: 'EXPO_PUBLIC_LOGGING_LEVEL',
} as const;

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

const readEnv = (key: string): string | undefined => {
  const value = process.env[key]?.trim();

  return value !== undefined && value.length > 0 ? value : undefined;
};

const parseAppEnvironment = (
  value: string | undefined,
): AppEnvironment =>
  APP_ENVIRONMENTS.find((environment) => environment === value) ??
  DEFAULT_APP_ENVIRONMENT;

const parseLoggingLevel = (value: string | undefined): LoggingLevel =>
  LOGGING_LEVELS.find((loggingLevel) => loggingLevel === value) ??
  DEFAULT_LOGGING_LEVEL;

const parseFeatureFlags = (value: string | undefined): readonly string[] => {
  if (value === undefined) {
    return [];
  }

  return value
    .split(',')
    .map((featureFlag) => featureFlag.trim())
    .filter((featureFlag) => featureFlag.length > 0);
};

const getRuntimeConfigExtra = (): RuntimeConfigExtra => ({
  appEnvironment: parseAppEnvironment(readEnv(ENV_KEYS.APP_ENV)),
  apiUrl: readEnv(ENV_KEYS.API_URL) ?? DEFAULT_API_URL,
  deepLinkScheme:
    readEnv(ENV_KEYS.DEEP_LINK_SCHEME) ?? DEFAULT_DEEP_LINK_SCHEME,
  featureFlags: parseFeatureFlags(readEnv(ENV_KEYS.FEATURE_FLAGS)),
  loggingLevel: parseLoggingLevel(readEnv(ENV_KEYS.LOGGING_LEVEL)),
});

export default ({ config }: ConfigContext): ExpoConfig => {
  const runtimeConfig = getRuntimeConfigExtra();

  return {
    ...config,
    name: config.name ?? 'ChanQs RN Tutorial',
    slug: config.slug ?? 'chanqs-rn-tutorial',
    scheme: runtimeConfig.deepLinkScheme,
    extra: {
      ...config.extra,
      runtimeConfig,
    },
  };
};
