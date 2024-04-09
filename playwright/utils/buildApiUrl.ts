import { compile } from 'path-to-regexp';

import config from 'configs/app';
import isNeedProxy from 'lib/api/isNeedProxy';
import { RESOURCES } from 'lib/api/resources';
import type { ApiResource, ResourceName, ResourcePathParams } from 'lib/api/resources';

export default function buildUrl<R extends ResourceName>(
  resourceName: R,
  pathParams?: ResourcePathParams<R>,
): string {
  const resource: ApiResource = RESOURCES[resourceName];
  const baseUrl = isNeedProxy() ? config.app.baseUrl : (resource.endpoint || config.api.endpoint);
  const basePath = resource.basePath !== undefined ? resource.basePath : config.api.basePath;
  const path = isNeedProxy() ? '/node-api/proxy' + basePath + resource.path : basePath + resource.path;
  const url = new URL(compile(path)(pathParams || {}), baseUrl);
  return url.toString();
}
