import PurchaseOrder from '@sales/domain/PurchaseOrder';
import Query from '@shared/abstractions/Query';

export type GetPurchaseOrderParams = {
  purchaseOrderId: string;
}

export default class GetPurchaseOrderQuery extends Query<PurchaseOrder, GetPurchaseOrderParams> {}
