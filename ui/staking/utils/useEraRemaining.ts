import type { ApiPromise } from '@polkadot/api';
import duration from 'dayjs/plugin/duration';
import { useEffect, useState } from 'react';

import type { Option } from '@polkadot/types';
import type { ActiveEraInfo } from '@polkadot/types/interfaces';

import dayjs from 'lib/date/dayjs';

type CalcRemainingProps = {
  genesisSlot: number;
  epochIndex: number;
  sessionLength: number;
  currentSlot: number;
  currentIndex: number;
  erasStartSessionIndex: number;
  sessionsPerEra: number;
  expectedBlockTime: number;
}

dayjs.extend(duration);

const calcRemaining = ({
  genesisSlot,
  epochIndex,
  sessionLength,
  currentSlot,
  currentIndex, // current session index
  erasStartSessionIndex,
  sessionsPerEra,
  expectedBlockTime,
}: CalcRemainingProps): number => {
  const estimatedEraLength = sessionsPerEra * sessionLength * expectedBlockTime;
  const epochStartSlot = epochIndex * sessionLength + genesisSlot;
  const sessionProgress = currentSlot - epochStartSlot;
  const erasProgress = (currentIndex - erasStartSessionIndex) * sessionLength + sessionProgress;

  return estimatedEraLength - erasProgress * 6000;
};

export const useEraRemaining = ({ api }: { api?: ApiPromise }) => {
  const [ remaining, setRemaining ] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const expectedBlockTime = api.consts.babe.expectedBlockTime.toPrimitive() as number;

    const main = async() => {
      // session length is the same as epoch epochDuration
      // now it's 100 slots
      const sessionLength = api.consts.babe.epochDuration.toPrimitive() as number;

      // activeEra is an object with two fields
      // we actually just need index of era
      const activeEra = (await api.query.staking.activeEra() as Option<ActiveEraInfo>).unwrap();

      // check https://polkadot.js.org/docs/substrate/storage for every query
      const [ currentIndex, currentSlot, epochIndex, genesisSlot, erasStartSessionIndex ] = (await api.queryMulti([
        api.query.session.currentIndex,
        api.query.babe.currentSlot,
        api.query.babe.epochIndex,
        api.query.babe.genesisSlot,
        [ api.query.staking.erasStartSessionIndex, activeEra.index ],
      ])).map(item => item.toPrimitive() as number);

      setRemaining(calcRemaining({
        currentIndex,
        currentSlot,
        genesisSlot,
        erasStartSessionIndex,
        sessionLength,
        epochIndex,
        sessionsPerEra: api.consts.staking.sessionsPerEra.toPrimitive() as number,
        expectedBlockTime,
      }));
    };

    main();

    const unsubHeads = api.rpc.chain.subscribeNewHeads(main);

    return () => {
      unsubHeads.then(unsub => unsub());
    };
  }, [ api ]);

  return dayjs.duration(remaining);
};
