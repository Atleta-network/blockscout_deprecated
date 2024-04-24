import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';

import type { Option } from '@polkadot/types';
import type { ActiveEraInfo } from '@polkadot/types/interfaces';

import { usePolkadotApi } from 'lib/polkadot/context';
import { useRegistry } from 'lib/polkadot/useRegistry';

import { getErasPerDay, getAverageEraValidatorReward } from './utils';

export const useAverageRewardRate = () => {
  const [ result, setResult ] = useState({ averageRewardRate: '0.0', inflationRate: '0.0' });
  const { api } = usePolkadotApi();
  const { decimals } = useRegistry();

  useEffect(() => {
    if (!api) {
      return;
    }

    const unsubscribePromise = api.queryMulti([
      api.query.staking.activeEra,
      api.query.balances.totalIssuance,
    ], async([ activeEra, totalIssuance ]) => {
      const activeEraIndex = (activeEra as Option<ActiveEraInfo>).unwrap().index.toString();

      const previousEraIndex = Number(activeEraIndex) - 1;

      const totalStake = await api.query.staking.erasTotalStake(previousEraIndex);

      const erasPerDay = getErasPerDay(
        api.consts.staking.sessionsPerEra.toString(),
        api.consts.babe.epochDuration.toString(),
        api.consts.babe.expectedBlockTime.toString(),
      );

      const averageEraValidatorReward = await getAverageEraValidatorReward({
        api,
        activeEra: BigNumber(activeEraIndex),
        days: 15,
        erasPerDay,
      });

      const averageRewardPerDay = averageEraValidatorReward.multipliedBy(erasPerDay);

      const totalIssuanceUnit = new BigNumber(totalIssuance.toString()).shiftedBy(-Number(decimals));
      const lastTotalStakeUnit = new BigNumber(totalStake.toString()).shiftedBy(-Number(decimals));

      const supplyStaked =
        lastTotalStakeUnit.isZero() || totalIssuanceUnit.isZero() ?
          new BigNumber(0) :
          lastTotalStakeUnit.dividedBy(totalIssuanceUnit);

      const dayRewardRate = new BigNumber(averageRewardPerDay).dividedBy(
        new BigNumber(totalIssuance.toString()).dividedBy(100),
      );

      const multipilier = dayRewardRate
        .dividedBy(100)
        .plus(1)
        .exponentiatedBy(365);

      const inflationToStakers = new BigNumber(100)
        .multipliedBy(multipilier)
        .minus(100);

      const averageRewardRate = inflationToStakers.dividedBy(supplyStaked);

      setResult({
        averageRewardRate: averageRewardRate.decimalPlaces(2).toFormat(),
        inflationRate: inflationToStakers.decimalPlaces(2).toFormat(),
      });
    });

    return () => {
      unsubscribePromise.then(unsub => unsub());
    };
  }, [ api, decimals ]);

  return result;
};
