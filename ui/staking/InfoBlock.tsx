import { Box, Flex } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { useRegistry } from 'lib/polkadot/useRegistry';

import { useInfo } from './utils/useInfo';

const InfoBlock = () => {
  const info = useInfo();
  const registry = useRegistry();

  const poolInfo: Array<{ title: string; description: string }> = useMemo(() => [
    {
      title: `${ info.poolMembersCounter.toFormat(0) } members are actively bonding in pools.`,
      description: 'The total number of accounts that have joined a pool.',
    },
    {
      title: `${ info.totalValueLocked.toFormat(0) } ${ registry.symbol } is currently bonded in pools.`,
      description: `The total ${ registry.symbol } currently bonded in nomination pools.`,
    },
    {
      title: `${ info.totalStake.toFormat(0) } ${ registry.symbol } is currently being staked on Polkadot.`,
      description:
				`The total ${ registry.symbol } currently being staked amongst all validators and nominators.`,
    },
  ], [ info, registry ]);

  return (
    <Flex
      direction={{ base: 'row', lg: 'column' }}
      flexWrap={{ base: 'wrap', lg: 'wrap' }}
      justifyContent={{ base: 'flex-start', lg: 'flex-start' }}
      // marginTop={24}
      gap={ 8 }
    >
      { poolInfo.map((elem, index) => (
        <Box key={ index } flex={{ base: '0 0 100%', lg: '0 0 100%' }}>
          <div>
            <strong>{ elem.title }</strong>
          </div>
          <div>{ elem.description }</div>
        </Box>
      )) }
    </Flex>
  );
};

export default InfoBlock;
