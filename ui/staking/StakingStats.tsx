/* eslint-disable react/jsx-curly-spacing */
import { Grid } from '@chakra-ui/react';
import React from 'react';

import { usePolkadotApi } from 'lib/polkadot/context';

import StatsItem from '../home/StatsItem';
import { useEraRemaining } from './utils/useEraRemaining';
import { useSupply } from './utils/useSupply';

const StakingStats = () => {
  const { api } = usePolkadotApi();

  const eraRemaining = useEraRemaining({ api });
  const supply = useSupply({ api });

  return (
    <Grid
      gridTemplateColumns={{ lg: `repeat(4, 1fr)`, base: '1fr 1fr' }}
      gridTemplateRows={{ lg: 'none', base: undefined }}
      gridGap="10px"
      marginTop="24px"
    >
      <StatsItem
        icon="txn_batches"
        title="Average Reward Rate"
        value="17.43%"
        tooltipLabel="Estimated annual return of staking rewards."
      />
      <StatsItem
        icon="block"
        title={ `${ api?.registry.chainTokens[0] } Supply Staked` }
        value={ `${ supply }%` }
        tooltipLabel={
          `Cumulative supply of ${ api?.registry.chainTokens[0] } being staked` +
          ` globally relative to the total supply of ${ api?.registry.chainTokens[0] }.`
        }
      />
      <StatsItem
        icon="clock-light"
        title="Time Remaining This Era"
        value={ `${ Math.trunc(eraRemaining.asHours()) }h ${ eraRemaining.minutes() }m ${ eraRemaining.seconds() }s` }
        tooltipLabel="At the end of each era, validators are rewarded DOT based on era points accumulated.  1 era is currently 24 hours in Polkadot."
      />
    </Grid>
  );
};

export default StakingStats;
