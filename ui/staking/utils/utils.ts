import type { ApiPromise } from '@polkadot/api';
import BigNumber from 'bignumber.js';

import type { Dayjs } from 'lib/date/dayjs';

export const getErasPerDay = (sessionsPerEraStr: string, epochDurationStr: string, expectedBlockTimeStr: string): BigNumber => {
  const sessionsPerEra = new BigNumber(sessionsPerEraStr);
  const epochDuration = new BigNumber(epochDurationStr);
  const expectedBlockTime = new BigNumber(expectedBlockTimeStr);

  const DAY_MS = new BigNumber(86400000);

  // Calculates how many eras there are in a 24 hour period.
  if (
    epochDuration.isZero() ||
    sessionsPerEra.isZero() ||
    expectedBlockTime.isZero()
  ) {
    return new BigNumber(0);
  }

  const blocksPerEra = epochDuration.multipliedBy(sessionsPerEra);
  const msPerEra = blocksPerEra.multipliedBy(expectedBlockTime);

  return DAY_MS.dividedBy(msPerEra);
};

export const getAverageEraValidatorReward = async(
  {
    api,
    activeEra,
    days,
    erasPerDay,
  }: {
    api: ApiPromise;
    activeEra: BigNumber;
    days: number;
    erasPerDay: BigNumber;
  },
) => {
  // Calculates the number of eras required to calculate required `days`, not surpassing
  // historyDepth.
  const endEra = BigNumber.max(
    activeEra.minus(erasPerDay.multipliedBy(days)),
    BigNumber.max(0, activeEra.minus(api.consts.staking.historyDepth.toString())),
  );

  const eras: Array<string> = [];

  let thisEra = activeEra.minus(1);

  do {
    eras.push(thisEra.toString());
    thisEra = thisEra.minus(1);
  } while (thisEra.gte(endEra));

  const validatorEraRewards = await api.query.staking.erasValidatorReward.multi(eras);
  const reward = validatorEraRewards
    .map((v) => {
      const value = new BigNumber(v.toString() === '' ? 0 : v.toString());

      if (value.isNaN()) {
        return new BigNumber(0);
      }

      return value;
    })
    .reduce((prev, current) => prev.plus(current), new BigNumber(0))
    .div(eras.length);

  return reward;
};

// how many eras passed from day start
export const getErasPassedToday = (erasPerDay: number, now: Dayjs, dayStart: Dayjs) => {
  const MILIS_IN_DAY = 86400000;

  const milisPassedFromDayStart = now.valueOf() - dayStart.valueOf();

  return Math.trunc(erasPerDay * (milisPassedFromDayStart / MILIS_IN_DAY));
};
