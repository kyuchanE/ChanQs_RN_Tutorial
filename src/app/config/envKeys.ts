export const ENV_KEYS = {
  API_URL: 'EXPO_PUBLIC_API_URL',
  DEEP_LINK_SCHEME: 'EXPO_PUBLIC_DEEP_LINK_SCHEME',
  FEATURE_FLAGS: 'EXPO_PUBLIC_FEATURE_FLAGS',
  LOGGING_LEVEL: 'EXPO_PUBLIC_LOGGING_LEVEL',
} as const;

export type EnvKey = (typeof ENV_KEYS)[keyof typeof ENV_KEYS];

export type AppEnvironment = 'local' | 'development' | 'staging' | 'production';

export type LoggingLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

