import Query from '@shared/abstractions/Query';

export default class GetPurchaseOrderQuery extends Query {
  constructor(readonly purchaseOrderId: string) {
    super();
  }
}
