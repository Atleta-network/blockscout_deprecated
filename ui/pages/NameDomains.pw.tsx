import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import config from 'configs/app';
import * as ensDomainMock from 'mocks/ens/domain';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import NameDomains from './NameDomains';

const DOMAINS_LOOKUP_API_URL = buildApiUrl('domains_lookup', { chainId: config.chain.id }) + '?only_active=true';

test('default view +@mobile', async({ mount, page }) => {
  await page.route(DOMAINS_LOOKUP_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({
      items: [
        ensDomainMock.ensDomainA,
        ensDomainMock.ensDomainB,
        ensDomainMock.ensDomainC,
        ensDomainMock.ensDomainD,
      ],
      next_page_params: {
        token_id: '<token-id>',
      },
    }),
  }));

  const component = await mount(
    <TestApp>
      <NameDomains/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
