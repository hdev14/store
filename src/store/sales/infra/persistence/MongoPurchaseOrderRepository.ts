/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import Product from '@sales/domain/Product';
import PurchaseOrder, { PurchaseOrderParams, PurchaseOrderStatus } from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import Voucher from '@sales/domain/Voucher';
import PurchaseOrderItemModel, { IPurchaseOrderItem } from '@mongoose/PurchaseOrderItemModel';
import PurchaseOrderModel, { IPurchaseOrder } from '@mongoose/PurchaseOrderModel';
import VoucherModel, { IVoucher } from '@mongoose/VoucherModel';
import UserModel, { IUser } from '@mongoose/UserModel';
import { IProduct } from '@mongoose/ProductModel';

export default class MongoPurchaseOrderRepository implements IPurchaseOrderRepository {
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

  public async getPurchaseOrdersByClientId(id: string): Promise<PurchaseOrder[]> {
    const client = await UserModel.findOne({ id });

    if (!client) {
      return [];
    }

    const purchaseOrders = await PurchaseOrderModel.find({ client: client._id })
      .populate('client')
      .populate('voucher')
      .populate({
        path: 'items',
        populate: {
          path: 'product',
          select: 'id name amount',
        },
      });

    return purchaseOrders.map(this.mapPurchaseOrder.bind(this));
  }

  public async getDraftPurchaseOrderByClientId(id: string): Promise<PurchaseOrder | null> {
    const client = await UserModel.findOne({ id });

    if (!client) {
      return null;
    }

    const purchaseOrder = await PurchaseOrderModel
      .findOne({ client: client._id, status: PurchaseOrderStatus.DRAFT })
      .populate('client')
      .populate({
        path: 'items',
        populate: {
          path: 'product',
          select: 'id name amount',
        },
      });

    return purchaseOrder ? this.mapPurchaseOrder(purchaseOrder) : null;
  }

  public async getPurchaseOrderItemById(id: string): Promise<PurchaseOrderItem | null> {
    throw new Error('Method not implemented.');
  }

  public async getPurchaseOrderItem(params: { purchaseOrderId: string; }): Promise<PurchaseOrderItem | null>;

  public async getPurchaseOrderItem(params: { productId: string; }): Promise<PurchaseOrderItem | null>;

  public async getPurchaseOrderItem(params: { purchaseOrderId?: string | undefined; productId?: string | undefined; }): Promise<PurchaseOrderItem | null>;

  public async getPurchaseOrderItem(params: unknown): Promise<import('../../domain/PurchaseOrderItem').default | null> {
    throw new Error('Method not implemented.');
  }

  public async getVoucherByCode(code: number): Promise<Voucher | null> {
    throw new Error('Method not implemented.');
  }

  public async addPurchaseOrder(purchaseOrder: PurchaseOrder): Promise<PurchaseOrder> {
    const client = await UserModel.findOne({ id: purchaseOrder.clientId });

    if (!client) {
      throw new Error('Cliente não encontrado.');
    }

    const voucher = purchaseOrder.voucher
      ? await VoucherModel.findOne({ id: purchaseOrder.voucher.id })
      : null;

    const items = await PurchaseOrderItemModel.find({
      id: { $in: purchaseOrder.items.map((item) => item.id) },
    });

    const createdPurchaseOrder = await PurchaseOrderModel.create({
      id: purchaseOrder.id,
      client: client._id,
      items: items.map(({ _id }) => _id),
      voucher: voucher ? voucher._id : undefined,
      code: purchaseOrder.code,
      totalAmount: purchaseOrder.totalAmount,
      discountAmount: purchaseOrder.discountAmount,
      status: purchaseOrder.status,
      createdAt: purchaseOrder.createdAt,
    });

    const populatedPurchaseOrder = await PurchaseOrderModel.populate(createdPurchaseOrder, { path: 'voucher' });

    return this.mapPurchaseOrder(populatedPurchaseOrder);
  }

  public async updatePurchaseOrder(purchaseOrder: PurchaseOrder): Promise<PurchaseOrder> {
    const purchaseOrderToUpdate = await PurchaseOrderModel.findOne(
      { id: purchaseOrder.id },
    );

    if (!purchaseOrderToUpdate) {
      throw new Error('PurchaseOrder not found');
    }

    purchaseOrderToUpdate.code = purchaseOrder.code;
    purchaseOrderToUpdate.discountAmount = purchaseOrder.discountAmount;
    purchaseOrderToUpdate.totalAmount = purchaseOrder.totalAmount;
    purchaseOrderToUpdate.status = purchaseOrder.status;

    const voucher = purchaseOrder.voucher
      ? await VoucherModel.findOne({ id: purchaseOrder.voucher.id })
      : undefined;

    if (voucher) {
      purchaseOrderToUpdate.voucher = voucher._id;
    }

    purchaseOrderToUpdate.items = (
      await PurchaseOrderItemModel.find({
        id: { $in: purchaseOrder.items.map((item) => item.id) },
      })
    ).map((item) => item._id);

    await purchaseOrderToUpdate.save();

    const populatedPurchaseOrder = await PurchaseOrderModel.populate(
      purchaseOrderToUpdate,
      { path: 'voucher' },
    );

    return this.mapPurchaseOrder(populatedPurchaseOrder);
  }

  public async addPurchaseOrderItem(purchaseOrderItem: PurchaseOrderItem): Promise<PurchaseOrderItem> {
    throw new Error('Method not implemented.');
  }

  public async updatePurchaseOrderItem(purchaseOrderItem: PurchaseOrderItem): Promise<PurchaseOrderItem> {
    throw new Error('Method not implemented.');
  }

  public async deletePurchaseOrderItem(purchasOrderItemId: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  public async countPurchaseOrders(): Promise<number> {
    throw new Error('Method not implemented.');
  }

  public async countPurchaseOrderItems(): Promise<number> {
    throw new Error('Method not implemented.');
  }

  public async countVouchers(): Promise<number> {
    throw new Error('Method not implemented.');
  }

  private mapPurchaseOrder(purchaseOrder: IPurchaseOrder): PurchaseOrder {
    const params: PurchaseOrderParams = {
      id: purchaseOrder.id,
      clientId: (purchaseOrder.client as unknown as IUser).id,
      code: purchaseOrder.code,
      totalAmount: purchaseOrder.totalAmount,
      discountAmount: purchaseOrder.discountAmount,
      status: purchaseOrder.status as PurchaseOrderStatus,
      createdAt: purchaseOrder.createdAt,
      voucher: purchaseOrder.voucher
        ? this.mapVoucher(purchaseOrder.voucher as unknown as IVoucher)
        : null,
    };

    const po = new PurchaseOrder(params);

    if (purchaseOrder.items) {
      purchaseOrder.items.forEach((item) => {
        po.addItem(this.mapPurchaseOrderItem(item as unknown as IPurchaseOrderItem));
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
    const product = purchaseOrderItem.product as unknown as IProduct;

    return new PurchaseOrderItem({
      id: purchaseOrderItem.id,
      quantity: purchaseOrderItem.quantity,
      product: new Product(
        product.id,
        product.name,
        product.amount,
      ),
    });
  }
}
