import type { Transaction, TransactionsResponse } from 'types/api/transaction';

import { ADDRESS_PARAMS } from './addressParams';

export const TX_HASH = '0x3ed9d81e7c1001bdda1caa1dc62c0acbbe3d2c671cdc20dc1e65efdaa4186967';

export const TX: Transaction = {
  timestamp: '2022-11-11T11:11:11.000000Z',
  fee: {
    type: 'actual',
    value: '2100000000000000',
  },
  gas_limit: '21000',
  block: 9004925,
  status: 'ok',
  method: 'placeholder',
  confirmations: 71,
  type: 0,
  exchange_rate: '1828.71',
  to: ADDRESS_PARAMS,
  tx_burnt_fee: null,
  max_fee_per_gas: null,
  result: 'success',
  hash: '0x2b824349b320cfa72f292ab26bf525adb00083ba9fa097141896c3c8c74567cc',
  gas_price: '100000000000',
  priority_fee: null,
  base_fee_per_gas: '24',
  from: ADDRESS_PARAMS,
  token_transfers: null,
  tx_types: [
    'coin_transfer',
  ],
  gas_used: '21000',
  created_contract: null,
  position: 0,
  nonce: 295929,
  has_error_in_internal_txs: false,
  actions: [],
  decoded_input: null,
  token_transfers_overflow: false,
  raw_input: '0x',
  value: '42000420000000000000',
  max_priority_fee_per_gas: null,
  revert_reason: null,
  confirmation_duration: [
    0,
    14545,
  ],
  tx_tag: null,
};

export const TXS: TransactionsResponse = {
  items: Array(50).fill(TX),
  next_page_params: {
    block_number: 9005713,
    index: 5,
    items_count: 50,
    filter: 'validated',
  },
};
