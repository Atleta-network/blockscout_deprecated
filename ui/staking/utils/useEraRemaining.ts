import duration from 'dayjs/plugin/duration';
import { useEffect, useState } from 'react';

import type { Option } from '@polkadot/types';
import type { ActiveEraInfo } from '@polkadot/types/interfaces';

import dayjs from 'lib/date/dayjs';
import { usePolkadotApi } from 'lib/polkadot/context';

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
  // era length in slots
  const estimatedEraLength = sessionsPerEra * sessionLength * expectedBlockTime;
  // when epoch started
  const epochStartSlot = epochIndex * sessionLength + genesisSlot;
  // how many sessions pasted since era start
  const sessionProgress = currentSlot - epochStartSlot;
  // era pogress in slots
  const erasProgress = (currentIndex - erasStartSessionIndex) * sessionLength + sessionProgress;

  // slots length possinble may be in constants
  // now it's 6000
  return estimatedEraLength - erasProgress * 6000;
};

export const useEraRemaining = () => {
  const [ remaining, setRemaining ] = useState(0);
  const { api } = usePolkadotApi();

  useEffect(() => {
    if (!api) {
      return;
    }

    const expectedBlockTime = api.consts.babe.expectedBlockTime.toPrimitive() as number;

    const main = async() => {
      // session length is the same as epoch epochDuration
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
