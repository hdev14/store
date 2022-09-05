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

  getPurchaseOrderItem(params: { purchaseOrderId: string, productId: string }): Promise<PurchaseOrderItem | null>;

  addPurchaseOrderItem(purchaseOrderItem: PurchaseOrderItem): Promise<PurchaseOrderItem>;

  updatePurchaseOrderItem(purchaseOrderItem: PurchaseOrderItem): Promise<PurchaseOrderItem>;

  deletePurchaseOrderItem(purchaseOrderItem: PurchaseOrderItem): Promise<boolean>;

  getVoucherByCode(code: string): Promise<Voucher | null>;
}

export default IPurchaseOrderRepository;
