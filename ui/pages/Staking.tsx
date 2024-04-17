import { Flex, Grid, Heading } from '@chakra-ui/react';
import React from 'react';

import { usePolkadotApi } from 'lib/polkadot/context';
import { useRegistry } from 'lib/polkadot/useRegistry';
import ChartWidget from 'ui/shared/chart/ChartWidget';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import PageTitle from 'ui/shared/Page/PageTitle';
import InfoBlock from 'ui/staking/InfoBlock';
import StakingStats from 'ui/staking/StakingStats';
import { useAverageRewardRate } from 'ui/staking/utils/useAverageRewardRate';
import { useRecentPayouts } from 'ui/staking/utils/useRecentPayouts';
import { useStats } from 'ui/staking/utils/useStats';

const Staking = () => {
  const { isLoading } = usePolkadotApi();
  const { averageRewardRate, inflationRate } = useAverageRewardRate();
  const registry = useRegistry();
  const stats = useStats();
  const chartData = useRecentPayouts(4);

  const detailsInfoItems = [
    {
      title: 'Total Validators',
      hint: 'Validators secure the Polkadot Relay Chain by validating blocks.',
      isLoading,
      value: stats.totalValidators,
    },
    {
      title: 'Total Nominators',
      hint: 'Stakers in the network include accounts, whether active or inactive in the current session.',
      isLoading,
      value: stats.totalNominators,
    },
    {
      title: 'Active Pools',
      hint: 'The current amount of active nomination pools on Polkadot.',
      isLoading,
      value: stats.activePools,
    },
    {
      title: 'Inflation Rate to Stakers',
      hint: `${ registry.symbol } has unlimited supply with ~10% annual inflation. Validator rewards depend on staked amounts.`,
      isLoading,
      value: `${ inflationRate }%`,
    },
  ];

  return (
    <div>
      <PageTitle title="Overview"/>
      <StakingStats averageRewardRate={ averageRewardRate }/>
      <ChartWidget
        marginTop="20px"
        items={ chartData }
        title="Recent Payouts"
        units={ registry.symbol }
        description={ `0 ${ registry.symbol }` }
        isLoading={ isLoading }
        isError={ false }
        minH="230px"
      />
      <Heading as="h4" size="sm" mt={ 4 } mb={ 4 }>
				Network Stats
      </Heading>
      <Flex
        direction={{ base: 'column', lg: 'column' }}
        marginTop={ 4 }
        alignItems="flex-start"
        gap={ 8 }
      >
        <Flex
          direction={{ base: 'column', lg: 'column' }}
          marginTop={ 4 }
          alignItems="flex-start"
          gap={ 8 }
        >
          <Grid
            gridTemplateColumns={{
              lg: `repeat(8, 1fr)`,
              base: '1fr 1fr',
            }}
            gridTemplateRows={{ lg: 'none', base: undefined }}
            gridGap="10px"
            alignItems="center"
          >
            { detailsInfoItems.map((item, index) => (
              <DetailsInfoItem
                key={ index }
                title={ item.title }
                hint={ item.hint }
                isLoading={ item.isLoading }
              >
                { item.value }
              </DetailsInfoItem>
            )) }
          </Grid>
        </Flex>
        <InfoBlock/>
      </Flex>
    </div>
  );
};

export default Staking;
