import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import DefaultView from './specs/DefaultView';
import LongNameAndManyTags from './specs/LongNameAndManyTags';
import WithTextAd from './specs/WithTextAd';

test('default view +@mobile', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <DefaultView/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('with text ad +@mobile', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <WithTextAd/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('with long name and many tags +@mobile', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <LongNameAndManyTags/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
