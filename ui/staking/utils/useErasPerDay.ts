import type { ApiPromise } from '@polkadot/api';
import BigNumber from 'bignumber.js';

export const useErasPerDay = ({ api }: { api: ApiPromise }) => {
  const sessionsPerEra = new BigNumber(api.consts.staking.sessionsPerEra.toString());
  const epochDuration = new BigNumber(api.consts.babe.epochDuration.toString());
  const expectedBlockTime = new BigNumber(api.consts.babe.sessionsPerEra.toString());

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
