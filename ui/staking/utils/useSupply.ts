import type { ApiPromise } from '@polkadot/api';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';

import type { Option } from '@polkadot/types';
import type { ActiveEraInfo } from '@polkadot/types/interfaces';

export const useSupply = ({ api }: { api?: ApiPromise}) => {
  const [ supply, setSupply ] = useState('100');

  useEffect(() => {
    if (!api) {
      return;
    }

    const unsubscribePromise = api.queryMulti([
      api.query.balances.totalIssuance,
      api.query.staking.activeEra,
    ], async([ totalIssuance, activeEra ]) => {
      const activeEraIndex = (activeEra as Option<ActiveEraInfo>).unwrap().index.toPrimitive();

      const totalStake = await api.query.staking.erasTotalStake(activeEraIndex);

      const supply = new BigNumber(totalStake.toString()).dividedBy(totalIssuance.toString()).multipliedBy(100);

      setSupply(supply.toFixed(2));
    });

    return () => {
      unsubscribePromise.then(unsub => unsub());
    };
  }, [ api ]);

  return supply;
};
