import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import Product from '@sales/domain/Product';
import PurchaseOrder, { PurchaseOrderParams, PurchaseOrderStatus } from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import Voucher from '@sales/domain/Voucher';
import { IPurchaseOrderItem } from '@mongoose/PurchaseOrderItemModel';
import PurchaseOrderModel, { IPurchaseOrder } from '@mongoose/PurchaseOrderModel';
import { IVoucher } from '@mongoose/VoucherModel';

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

  public async getPurchaseOrderById(id: string): Promise<PurchaseOrder | null> {
    const purchaseOrder = await PurchaseOrderModel
      .findOne({ id })
      .populate('client')
      .populate('voucher')
      .populate({
        path: 'items',
        populate: {
          path: 'product',
          select: 'id name amount',
        },
      });

    return purchaseOrder ? this.mapPurchaseOrder(purchaseOrder) : null;
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

  private mapPurchaseOrder(purchaseOrder: IPurchaseOrder): PurchaseOrder {
    const params: PurchaseOrderParams = {
      id: purchaseOrder.id,
      clientId: purchaseOrder.client.id,
      code: purchaseOrder.code,
      totalAmount: purchaseOrder.totalAmount,
      discountAmount: purchaseOrder.discountAmount,
      status: purchaseOrder.status as PurchaseOrderStatus,
      createdAt: purchaseOrder.createdAt,
      voucher: purchaseOrder.voucher ? this.mapVoucher(purchaseOrder.voucher) : null,
    };

    const po = new PurchaseOrder(params);

    if (purchaseOrder.items) {
      purchaseOrder.items.forEach((item) => {
        po.addItem(this.mapPurchaseOrderItem(item));
      });
    }

    return po;
  }

  private mapVoucher(voucher: IVoucher) {
    return new Voucher({
      id: voucher.id,
      active: voucher.active,
      code: voucher.code,
      percentageAmount: voucher.percentageAmount,
      rawDiscountAmount: voucher.rawDiscountAmount,
      type: voucher.type,
      quantity: voucher.quantity,
      createdAt: voucher.createdAt,
      expiresAt: voucher.expiresAt,
      usedAt: voucher.usedAt,
    });
  }

  private mapPurchaseOrderItem(purchaseOrderItem: IPurchaseOrderItem) {
    return new PurchaseOrderItem({
      id: purchaseOrderItem.id,
      quantity: purchaseOrderItem.quantity,
      product: new Product(
        purchaseOrderItem.product.id,
        purchaseOrderItem.product.name,
        purchaseOrderItem.product.amount,
      ),
    });
  }
}
