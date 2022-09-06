/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import PurchaseOrder from './PurchaseOrder';
import PurchaseOrderItem from './PurchaseOrderItem';
import Voucher from './Voucher';

interface IPurchaseOrderRepository {
  getPurchaseOrderById(id: string): Promise<PurchaseOrder | null>;

  getPurchaseOrdersByClientId(id: string): Promise<PurchaseOrder[]>;

  getDraftPurchaseOrderByClientId(id: string): Promise<PurchaseOrder | null>;

  addPurchaseOrder(purchaseOrder: PurchaseOrder): Promise<PurchaseOrder>;

  updatePurchaseOrder(purchaseOrder: PurchaseOrder): Promise<PurchaseOrder>;

  getPurchaseOrderItemById(id: string): Promise<PurchaseOrderItem | null>;

  getPurchaseOrderItem(params: { purchaseOrderId: string }): Promise<PurchaseOrderItem | null>;
  getPurchaseOrderItem(params: { productId: string }): Promise<PurchaseOrderItem | null>;
  getPurchaseOrderItem(params: { purchaseOrderId?: string, productId?: string }): Promise<PurchaseOrderItem | null>;

  addPurchaseOrderItem(purchaseOrderItem: PurchaseOrderItem): Promise<PurchaseOrderItem>;

  updatePurchaseOrderItem(purchaseOrderItem: PurchaseOrderItem): Promise<PurchaseOrderItem>;

  deletePurchaseOrderItem(purchasOrderItemId: string): Promise<boolean>;

  getVoucherByCode(code: number): Promise<Voucher | null>;
}

export default IPurchaseOrderRepository;
