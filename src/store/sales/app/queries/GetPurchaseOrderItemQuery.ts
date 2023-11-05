import Query from '@shared/abstractions/Query';

export default class GetPurchaseOrderItemQuery extends Query {
  constructor(readonly purchase_order_item_id: string) {
    super();
  }
}
