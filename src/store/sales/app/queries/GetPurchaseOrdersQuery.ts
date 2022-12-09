import PurchaseOrder from '@sales/domain/PurchaseOrder';
import Query from '@shared/abstractions/Query';

export type GetPurchaseOrdersParams = {
  customerId: string;
}

// eslint-disable-next-line max-len
export default class GetPurchaseOrdersQuery extends Query<PurchaseOrder, GetPurchaseOrdersParams> {}
