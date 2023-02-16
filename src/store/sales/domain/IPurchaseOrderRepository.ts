/* eslint-disable max-len */
import PurchaseOrder from './PurchaseOrder';
import PurchaseOrderItem from './PurchaseOrderItem';
import Voucher from './Voucher';

export interface IPurchaseOrderRepositoryQueries {
  getPurchaseOrderById(id: string): Promise<PurchaseOrder | null>;

  getPurchaseOrdersByCustomerId(id: string): Promise<PurchaseOrder[]>;

  getDraftPurchaseOrderByCustomerId(id: string): Promise<PurchaseOrder | null>;

  getPurchaseOrderItemById(id: string): Promise<PurchaseOrderItem | null>;

  getPurchaseOrderItem(params: { purchaseOrderId: string, productId: string }): Promise<PurchaseOrderItem | null>;

  getVoucherByCode(code: number): Promise<Voucher | null>;
}

export interface IPurchaseOrderRepositoryCommands {
  addPurchaseOrder(purchaseOrder: PurchaseOrder): Promise<PurchaseOrder>;

  updatePurchaseOrder(purchaseOrder: PurchaseOrder): Promise<PurchaseOrder>;

  addPurchaseOrderItem(purchaseOrderItem: PurchaseOrderItem): Promise<PurchaseOrderItem>;

  updatePurchaseOrderItem(purchaseOrderItem: PurchaseOrderItem): Promise<PurchaseOrderItem>;

  deletePurchaseOrderItem(purchaseOrderItemId: string): Promise<boolean>;
}

interface IPurchaseOrderRepository extends IPurchaseOrderRepositoryQueries, IPurchaseOrderRepositoryCommands {

  countPurchaseOrders(): Promise<number>;

  countPurchaseOrderItems(): Promise<number>;

  countVouchers(): Promise<number>;
}

export default IPurchaseOrderRepository;
