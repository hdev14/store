import Query from '@shared/abstractions/Query';

export default class GetPurchaseOrderItemQuery extends Query {
  constructor(readonly purchaseOrderItemId: string) {
    super();
  }
}
