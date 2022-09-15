import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import Voucher from '@sales/domain/Voucher';

export default class MongoPurchaseOrderRepository implements IPurchaseOrderRepository {
  countPurchaseOrders(): Promise<number> {
    throw new Error('Method not implemented.');
  }

  countPurchaseOrderItems(): Promise<number> {
    throw new Error('Method not implemented.');
  }

  countVouchers(): Promise<number> {
    throw new Error('Method not implemented.');
  }

  getPurchaseOrderById(id: string): Promise<PurchaseOrder | null> {
    throw new Error('Method not implemented.');
  }

  getPurchaseOrdersByClientId(id: string): Promise<PurchaseOrder[]> {
    throw new Error('Method not implemented.');
  }

  getDraftPurchaseOrderByClientId(id: string): Promise<PurchaseOrder | null> {
    throw new Error('Method not implemented.');
  }

  getPurchaseOrderItemById(id: string): Promise<PurchaseOrderItem | null> {
    throw new Error('Method not implemented.');
  }

  getPurchaseOrderItem(params: { purchaseOrderId: string; }): Promise<PurchaseOrderItem | null>;

  getPurchaseOrderItem(params: { productId: string; }): Promise<PurchaseOrderItem | null>;

  getPurchaseOrderItem(params: { purchaseOrderId?: string | undefined; productId?: string | undefined; }): Promise<PurchaseOrderItem | null>;

  getPurchaseOrderItem(params: unknown): Promise<import('../../domain/PurchaseOrderItem').default | null> {
    throw new Error('Method not implemented.');
  }

  getVoucherByCode(code: number): Promise<Voucher | null> {
    throw new Error('Method not implemented.');
  }

  addPurchaseOrder(purchaseOrder: PurchaseOrder): Promise<PurchaseOrder> {
    throw new Error('Method not implemented.');
  }

  updatePurchaseOrder(purchaseOrder: PurchaseOrder): Promise<PurchaseOrder> {
    throw new Error('Method not implemented.');
  }

  addPurchaseOrderItem(purchaseOrderItem: PurchaseOrderItem): Promise<PurchaseOrderItem> {
    throw new Error('Method not implemented.');
  }

  updatePurchaseOrderItem(purchaseOrderItem: PurchaseOrderItem): Promise<PurchaseOrderItem> {
    throw new Error('Method not implemented.');
  }

  deletePurchaseOrderItem(purchasOrderItemId: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
