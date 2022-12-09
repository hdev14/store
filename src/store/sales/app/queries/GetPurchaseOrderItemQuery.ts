import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import Query from '@shared/abstractions/Query';

export type GetPurchaseOrderItemParams = {
  purchaseOrderItemId: string;
}

// eslint-disable-next-line max-len
export default class GetPurchaseOrderItemQuery extends Query<PurchaseOrderItem, GetPurchaseOrderItemParams> {}
