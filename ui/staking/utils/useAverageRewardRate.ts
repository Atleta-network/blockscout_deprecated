import type { ApiPromise } from '@polkadot/api';
import { useEffect, useState } from 'react';

import type { Option } from '@polkadot/types';
import type { ActiveEraInfo } from '@polkadot/types/interfaces';

import { useErasPerDay } from './useErasPerDay';

export const useAverageRewardRate = ({ api }: { api: ApiPromise }) => {
  const [ averageRewardRate, setAverageRewardRate ] = useState('0');

  const erasPerDay = useErasPerDay({ api });

  useEffect(() => {
    if (!api) {
      return;
    }

    const unsubscribePromise = api.queryMulti([
      api.query.staking.activeEra,
      api.query.balances.totalIssuance,
    ], async([ activeEra ]) => {
      const activeEraIndex = (activeEra as Option<ActiveEraInfo>).unwrap().index.toPrimitive() as number;

      const previousEraIndex = activeEraIndex - 1;

      const previousTotalStaking = await api.query.staking.erasTotalStake(previousEraIndex);

      // TODO: Finish logic
      setAverageRewardRate(previousTotalStaking.toString());
    });

    return () => {
      unsubscribePromise.then(unsub => unsub());
    };
  }, [ api, erasPerDay ]);

  return averageRewardRate;
};
