import { getEnvValue } from 'configs/app/utils';

import { usePolkadotApi } from './context';

export const useRegistry = () => {
  const { api, isSuccess } = usePolkadotApi();

  return {
    decimals: isSuccess ? api?.registry.chainDecimals[0].toString() : getEnvValue('NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS'),
    symbol: isSuccess ? api?.registry.chainTokens[0] : (getEnvValue('NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL') || '18'),
  };
};
