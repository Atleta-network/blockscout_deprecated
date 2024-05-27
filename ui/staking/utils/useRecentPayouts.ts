import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';

import type { Option } from '@polkadot/types';
import type { ActiveEraInfo } from '@polkadot/types/interfaces';

import dayjs from 'lib/date/dayjs';
import { usePolkadotApi } from 'lib/polkadot/context';
import { useRegistry } from 'lib/polkadot/useRegistry';

import { getErasPassedToday, getErasPerDay } from './utils';

type Payout = {
  date: Date;
  value: number;
};

export const useRecentPayouts = (days: number) => {
  const { api } = usePolkadotApi();
  const { decimals } = useRegistry();
  const [ recentPayouts, setRecentsPayouts ] = useState<Array<Payout>>([]);

  useEffect(() => {
    if (!api) {
      return;
    }

    const unsubscribePromise = api.queryMulti([ api.query.staking.activeEra ], (async([ activeEra ]: [ activeEra: Option<ActiveEraInfo>]) => {
      const erasPerDay = getErasPerDay(
        api.consts.staking.sessionsPerEra.toString(),
        api.consts.babe.epochDuration.toString(),
        api.consts.babe.expectedBlockTime.toString(),
      ).toNumber();

      const erasPassedFromDayStart = getErasPassedToday(erasPerDay, dayjs(), dayjs().startOf('day'));

      // when there is less than 1 era per day, we need to truncate numbers fraction
      const erasToView = Math.trunc(erasPerDay * days);

      const activeEraIndex = activeEra.unwrap().index.toPrimitive() as number;

      const erasToRequest = Array.from({ length: erasToView > activeEraIndex ? activeEraIndex : erasToView }).map(
        // we don't count eras that passed 'today'
        (_, idx) => activeEraIndex - idx - erasPassedFromDayStart,
      );

      const validatorEraRewards = await api.query.staking.erasValidatorReward.multi(erasToRequest);

      // just convert values from request to BigNumber, nothing special
      const mappedRewards = validatorEraRewards.map((v) => {
        const value = new BigNumber(v.toString() === '' ? 0 : v.toString());

        if (value.isNaN()) {
          return new BigNumber(0);
        }

        return value;
      });

      const rewardsByDay: Array<Payout> = [];

      // when there is more than 1 era per day,
      // we just simply count eras and accumulate byDay reward
      // and when eras count is equal to erasByDay one add result of accumulation to rewardsByDay
      if (erasPerDay > 0) {
        let counter = 1;
        let byDay = new BigNumber('0');

        mappedRewards.forEach((value, idx) => {
          if (counter === erasPerDay) {
            rewardsByDay.push({
              value: byDay.shiftedBy(-Number(decimals)).decimalPlaces(3).toNumber(),
              date: dayjs().subtract(Math.trunc((idx + 1) / erasPerDay), 'days').toDate(),
            });

            counter = 0;
            byDay = new BigNumber('0');
          }

          counter = counter + 1;
          byDay = byDay.plus(value);
        });
      }

      // but, when there is LESS than 1 era per day
      // we need to another algorithm:
      // calculate how many eras need to complete era - daysNeedToCompleteEra
      // and then by every era reward add it to rewardsByDay
      // to calculate when this reward was received:
      // 1) Find start date: now day - days from params
      // 2) Find days need to complete era: 1 / erasPerDay
      // 3) Find how many days passed from start to complete era with formula:
      //    daysNeedToCompleteEra * (eras.length - index of era) - 1
      // 4) Add value from 3) to start date
      //
      // Attention!
      // That means if you pass to hook 4 days
      // and yours erasPerDay is equal to 0.5
      // you get only 2 elements in rewardsByDay
      // the first date will be: now - 2 days
      // and the second will be: now - 4 days
      if (erasPerDay < 1) {
        const daysNeedToCompleteEra = Math.trunc(1 / erasPerDay);

        const startDate = dayjs().startOf('day').subtract(days, 'day');

        mappedRewards.forEach((value, idx, array) => {
          rewardsByDay.push({
            value: value.shiftedBy(-Number(decimals)).decimalPlaces(3).toNumber(),
            date: startDate.add(daysNeedToCompleteEra * (array.length - idx) - 1, 'days').toDate(),
          });
        });
      }

      setRecentsPayouts([ ...rewardsByDay ].reverse());
    }));

    return () => {
      unsubscribePromise.then((unsub: () => void) => unsub());
    };
  }, [ api, decimals, days ]);

  return recentPayouts;
};
