import { Box, Flex } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { usePolkadotApi } from 'lib/polkadot/context';

import { useInfo } from './utils/useInfo';

const InfoBlock = () => {
  const { api } = usePolkadotApi();
  const info = useInfo({ api });

  const poolInfo: Array<{ title: string; description: string }> = useMemo(() => [
    {
      title: `${ info.poolMembersCounter.toFormat() } members are actively bonding in pools.`,
      description: 'The total number of accounts that have joined a pool.',
    },
    {
      title: `${ info.totalValueLocked.toFormat() } ${ api?.registry.chainTokens[0] } is currently bonded in pools.`,
      description: `The total ${ api?.registry.chainTokens[0] } currently bonded in nomination pools.`,
    },
    {
      title: `${ info.totalStake.toFormat() } ${ api?.registry.chainTokens[0] } is currently being staked on Polkadot.`,
      description:
				`The total ${ api?.registry.chainTokens[0] } currently being staked amongst all validators and nominators.`,
    },
  ], [ info, api ]);

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
