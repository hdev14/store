import Query from '@shared/abstractions/Query';

export default class GetPurchaseOrderQuery extends Query {
  constructor(readonly purchase_order_id: string) {
    super();
  }
}
