import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';

import { usePolkadotApi } from 'lib/polkadot/context';
import type Stats from 'ui/home/Stats';

type Stats = {
  totalValidators: string;
  totalNominators: string;
  activePools: string;
}

export const useStats = () => {
  const [ stats, setStats ] = useState<Stats>({ totalValidators: '0', totalNominators: '0', activePools: '0' });
  const { api } = usePolkadotApi();

  useEffect(() => {
    if (!api) {
      return;
    }

    const unsubscribePromise = api.queryMulti(
      [
        api.query.staking.counterForValidators,
        api.query.staking.counterForNominators,
        api.query.nominationPools.counterForBondedPools,
      ], ([ totalValidators, totalNominators, activePools ]) => {
        setStats({
          totalValidators: new BigNumber(totalValidators.toString()).toFormat(),
          totalNominators: new BigNumber(totalNominators.toString()).toFormat(),
          activePools: new BigNumber(activePools.toString()).toFormat(),
        });
      },
    );

    return () => {
      unsubscribePromise.then(unsub => unsub());
    };
  }, [ api ]);

  return stats;
};
