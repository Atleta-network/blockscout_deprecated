import Cookies from 'js-cookie';

import isBrowser from './isBrowser';

export enum NAMES {
  NAV_BAR_COLLAPSED = 'nav_bar_collapsed',
  API_TOKEN = '_explorer_key',
  INVALID_SESSION = 'invalid_session',
  CONFIRM_EMAIL_PAGE_VIEWED = 'confirm_email_page_viewed',
  TXS_SORT = 'txs_sort',
  COLOR_MODE = 'chakra-ui-color-mode',
  COLOR_MODE_HEX = 'chakra-ui-color-mode-hex',
  INDEXING_ALERT = 'indexing_alert',
  MIXPANEL_DEBUG = '_mixpanel_debug',
  ADDRESS_NFT_DISPLAY_TYPE = 'address_nft_display_type',
  UUID = 'uuid',
}

export function get(name?: NAMES | undefined | null, serverCookie?: string) {
  if (!isBrowser()) {
    return serverCookie ? getFromCookieString(serverCookie, name) : undefined;
  }

  if (name) {
    return Cookies.get(name);
  }
}

export function set(name: string, value: string, attributes: Cookies.CookieAttributes = {}) {
  attributes.path = '/';

  return Cookies.set(name, value, attributes);
}

export function getFromCookieString(cookieString: string, name?: NAMES | undefined | null) {
  return cookieString.split(`${ name }=`)[1]?.split(';')[0];
}
