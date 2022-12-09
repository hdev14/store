import PurchaseOrder from '@sales/domain/PurchaseOrder';
import Query from '@shared/abstractions/Query';

export type GetPurchaseOrderItemsParams = {
  purchaseOrderId: string;
}

// eslint-disable-next-line max-len
export default class GetPurchaseOrderItemsQuery extends Query<PurchaseOrder, GetPurchaseOrderItemsParams> {}
