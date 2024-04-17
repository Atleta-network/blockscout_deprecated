import { ApiPromise, WsProvider } from '@polkadot/api';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

interface PolkadotApiContenxtType {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  api?: ApiPromise;
}

export const PolkadotApiContext = React.createContext<PolkadotApiContenxtType>({ isLoading: true, isError: false, isSuccess: false });

interface PolkadotApiProps {
  children: React.ReactNode;
  url?: string;
}

export function PolkadotApiProvider({ children, url }: PolkadotApiProps) {
  const { isLoading, isError, isSuccess, data } = useQuery({
    queryKey: [ 'PolkadotApi', url ],
    queryFn: async() => {
      const provider = new WsProvider(url);
      const api = await ApiPromise.create({ provider });

      return api;
    },
  });

  return (
    <PolkadotApiContext.Provider value={{
      isLoading,
      isSuccess,
      isError,
      api: data,
    }}>
      { children }
    </PolkadotApiContext.Provider>
  );
}

export function usePolkadotApi() {
  const context = React.useContext(PolkadotApiContext);

  if (context?.isLoading === undefined) {
    throw new Error('usePolkadotApi must be used within a PolkadotApiProvider');
  }

  return context;
}
