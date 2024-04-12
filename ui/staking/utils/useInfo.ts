import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';

import type { Option } from '@polkadot/types';
import type { ActiveEraInfo } from '@polkadot/types/interfaces';

import { usePolkadotApi } from 'lib/polkadot/context';
import { useRegistry } from 'lib/polkadot/useRegistry';

type UseInfoResult = {
  poolMembersCounter: BigNumber;
  totalValueLocked: BigNumber;
  totalStake: BigNumber;
};

export const useInfo = (): UseInfoResult => {
  const [ result, setResult ] = useState<UseInfoResult>({
    poolMembersCounter: new BigNumber(0),
    totalValueLocked: new BigNumber(0),
    totalStake: new BigNumber(0),
  });
  const { api } = usePolkadotApi();
  const registry = useRegistry();

  useEffect(() => {
    if (!api) {
      return;
    }

    const unsubPromise = api.queryMulti([
      api.query.nominationPools.counterForPoolMembers,
      api.query.nominationPools.totalValueLocked,
      api.query.staking.activeEra,
    ], async([ counterForPoolMembers, totalValueLocked, activeEra ]) => {
      const activeEraIndex = (activeEra as Option<ActiveEraInfo>).unwrap().index.toPrimitive();

      const totalStake = await api.query.staking.erasTotalStake(activeEraIndex);

      setResult({
        poolMembersCounter: new BigNumber(counterForPoolMembers.toString()),
        totalValueLocked: new BigNumber(totalValueLocked.toString()),
        totalStake: new BigNumber(totalStake.toString()).shiftedBy(-Number(registry.decimals)),
      });
    });

    return () => {
      unsubPromise.then(unsub => unsub());
    };
  }, [ api, registry ]);

  return result;
};
