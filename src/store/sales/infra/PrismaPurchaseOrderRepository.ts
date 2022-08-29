import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import Voucher from '@sales/domain/Voucher';

export default class PrismaPurchaseOrderRepository implements IPurchaseOrderRepository {
  getPurchaseOrderById(id: string): Promise<PurchaseOrder | null> {
    throw new Error('Method not implemented.');
  }

  getPurchaseOrdersByClientId(id: string): Promise<PurchaseOrder[]> {
    throw new Error('Method not implemented.');
  }

  getDraftPurchaseOrderByClientId(id: string): Promise<PurchaseOrder | null> {
    throw new Error('Method not implemented.');
  }

  addPurchaseOrder(purchaseOrder: PurchaseOrder): Promise<PurchaseOrder> {
    throw new Error('Method not implemented.');
  }

  updatePurchaseOrder(purchaseOrder: PurchaseOrder): Promise<PurchaseOrder> {
    throw new Error('Method not implemented.');
  }

  getPurchaseOrderItemById(id: string): Promise<PurchaseOrderItem | null> {
    throw new Error('Method not implemented.');
  }

  getPurchaseOrderItem(purchaseOrderId: string, productId: string): Promise<PurchaseOrderItem | null> {
    throw new Error('Method not implemented.');
  }

  addPurchaseOrderItem(purchaseOrderItem: PurchaseOrderItem): Promise<PurchaseOrderItem> {
    throw new Error('Method not implemented.');
  }

  updatePurchaseOrderItem(purchaseOrderItem: PurchaseOrderItem): Promise<PurchaseOrderItem> {
    throw new Error('Method not implemented.');
  }

  deletePurchaseOrderItem(purchaseOrderItem: PurchaseOrderItem): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  getVoucherByCode(code: string): Promise<Voucher | null> {
    throw new Error('Method not implemented.');
  }
}
