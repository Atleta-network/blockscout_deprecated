import { Grid } from '@chakra-ui/react';
import React from 'react';

import { useRegistry } from 'lib/polkadot/useRegistry';

import StatsItem from '../home/StatsItem';
import { useEraRemaining } from './utils/useEraRemaining';
import { useSupply } from './utils/useSupply';

const StakingStats = () => {
  const registry = useRegistry();

  const { erasProgress, estimatedEraLength } = useEraRemaining();
  const supply = useSupply();

  return (
    <Grid
      gridTemplateColumns={{ lg: `repeat(4, 1fr)`, base: '1fr 1fr' }}
      gridTemplateRows={{ lg: 'none', base: undefined }}
      gridGap="10px"
      marginTop="24px"
    >
      { /*
      // temporary removed due to strange value
      <StatsItem
        icon="txn_batches"
        title="Average Reward Rate"
        value={ `${ averageRewardRate }%` }
        tooltipLabel="Estimated annual return of staking rewards."
      />
      */ }
      <StatsItem
        icon="block"
        title={ `${ registry.symbol } Supply Staked` }
        value={ `${ supply }%` }
        tooltipLabel={
          `Cumulative supply of ${ registry.symbol } being staked` +
          ` globally relative to the total supply of ${ registry.symbol }.`
        }
      />
      <StatsItem
        icon="clock-light"
        title="Time Remaining This Era"
        value={ `${ Math.trunc(erasProgress.asHours()) }h ${ erasProgress.minutes() }m ${ erasProgress.seconds() }s` }
        tooltipLabel={
          `At the end of each era, validators are rewarded ${ registry.symbol } based on era points accumulated. ` +
          `1 era is currently ${ estimatedEraLength.asHours() } hour${ estimatedEraLength.asHours() > 1 ? 's' : '' } in Atleta.`
        }
      />
    </Grid>
  );
};

export default StakingStats;
