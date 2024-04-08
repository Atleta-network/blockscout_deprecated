import type { ArrayElement } from 'types/utils';

export const PROVIDERS = [
  'atlascan',
  'none',
] as const;

export type Provider = ArrayElement<typeof PROVIDERS>;
