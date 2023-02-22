import Query from '@shared/abstractions/Query';

export default class GetPurchaseOrdersQuery extends Query {
  constructor(readonly customerId: string) {
    super();
  }
}
