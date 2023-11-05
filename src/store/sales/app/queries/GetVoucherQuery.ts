import Query from '@shared/abstractions/Query';

export default class GetVoucherQuery extends Query {
  constructor(readonly voucher_code: number) {
    super();
  }
}
