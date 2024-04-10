import type { WindowProvider } from 'wagmi';

declare global {
  export interface Window {
    ethereum?: WindowProvider;
    ga?: {
      getAll: () => Array<{ get: (prop: string) => string }>;
    };
    abkw: string;
    __envs: Record<string, string>;
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
    }
  }
}
