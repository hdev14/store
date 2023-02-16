/* eslint-disable max-len */
import { IPurchaseOrderRepositoryQueries, IPurchaseOrderRepositoryCommands } from '@sales/domain/IPurchaseOrderRepository';
import Product from '@sales/domain/Product';
import PurchaseOrder, { PurchaseOrderParams, PurchaseOrderStatus } from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import Voucher from '@sales/domain/Voucher';
import PurchaseOrderItemModel, { IPurchaseOrderItem } from '@mongo/models/PurchaseOrderItemModel';
import PurchaseOrderModel, { IPurchaseOrder } from '@mongo/models/PurchaseOrderModel';
import VoucherModel, { IVoucher } from '@mongo/models/VoucherModel';
import ProductModel, { IProduct } from '@mongo/models/ProductModel';
import RepositoryError from '@shared/errors/RepositoryError';

export default class MongoPurchaseOrderRepository implements IPurchaseOrderRepositoryQueries, IPurchaseOrderRepositoryCommands {
  public async getPurchaseOrderById(id: string): Promise<PurchaseOrder | null> {
    const purchaseOrder = await PurchaseOrderModel
      .findOne({ _id: id })
      .populate({ path: 'voucher', model: VoucherModel })
      .populate({
        path: 'items',
        model: PurchaseOrderItemModel,
        populate: {
          path: 'product',
          select: '_id name amount',
          model: ProductModel,
        },
      });

    return purchaseOrder ? this.mapPurchaseOrder(purchaseOrder) : null;
  }

  public async getPurchaseOrdersByCustomerId(id: string): Promise<PurchaseOrder[]> {
    const purchaseOrders = await PurchaseOrderModel.find({ customer: id })
      .populate({ path: 'voucher', model: VoucherModel })
      .populate({
        path: 'items',
        model: PurchaseOrderItemModel,
        populate: {
          path: 'product',
          select: '_id name amount',
          model: ProductModel,
        },
      });

    return purchaseOrders.map(this.mapPurchaseOrder.bind(this));
  }

  public async getDraftPurchaseOrderByCustomerId(id: string): Promise<PurchaseOrder | null> {
    const purchaseOrder = await PurchaseOrderModel
      .findOne({ customer: id, status: PurchaseOrderStatus.DRAFT })
      .populate({
        path: 'items',
        model: PurchaseOrderItemModel,
        populate: {
          path: 'product',
          select: '_id name amount',
          model: ProductModel,
        },
      });

    return purchaseOrder ? this.mapPurchaseOrder(purchaseOrder) : null;
  }

  public async getPurchaseOrderItemById(id: string): Promise<PurchaseOrderItem | null> {
    const purchaseOrderItem = await PurchaseOrderItemModel.findOne(
      { _id: id },
      undefined,
      {
        populate: {
          path: 'product',
          select: '_id name amount',
          model: ProductModel,
        },
      },
    );

    return purchaseOrderItem ? this.mapPurchaseOrderItem(purchaseOrderItem) : null;
  }

  public async getPurchaseOrderItem(params: { purchaseOrderId: string, productId: string }): Promise<PurchaseOrderItem | null> {
    const purchaseOrderItem = await PurchaseOrderItemModel.findOne(
      { product: params.productId, purchaseOrder: params.purchaseOrderId },
      undefined,
      {
        populate: {
          path: 'product',
          select: '_id name amount',
          model: ProductModel,
        },
      },
    );

    return purchaseOrderItem ? this.mapPurchaseOrderItem(purchaseOrderItem) : null;
  }

  public async getVoucherByCode(code: number): Promise<Voucher | null> {
    const voucher = await VoucherModel.findOne({ code });

    return voucher ? this.mapVoucher(voucher) : null;
  }

  public async addPurchaseOrder(purchaseOrder: PurchaseOrder): Promise<PurchaseOrder> {
    const createdPurchaseOrder = await PurchaseOrderModel.create({
      _id: purchaseOrder.id,
      customer: purchaseOrder.customerId,
      items: purchaseOrder.items.map(({ id }) => id),
      voucher: purchaseOrder.voucher ? purchaseOrder.voucher.id : undefined,
      code: purchaseOrder.code,
      totalAmount: purchaseOrder.totalAmount,
      discountAmount: purchaseOrder.discountAmount,
      status: purchaseOrder.status,
      createdAt: purchaseOrder.createdAt,
    });

    const populatedPurchaseOrder = await PurchaseOrderModel.populate(
      createdPurchaseOrder,
      { path: 'voucher', model: VoucherModel },
    );

    return this.mapPurchaseOrder(populatedPurchaseOrder);
  }

  public async updatePurchaseOrder(purchaseOrder: PurchaseOrder): Promise<PurchaseOrder> {
    const purchaseOrderToUpdate = await PurchaseOrderModel.findOne(
      { _id: purchaseOrder.id },
    );

    if (!purchaseOrderToUpdate) {
      throw new Error('PurchaseOrder not found');
    }

    purchaseOrderToUpdate.code = purchaseOrder.code;
    purchaseOrderToUpdate.discountAmount = purchaseOrder.discountAmount;
    purchaseOrderToUpdate.totalAmount = purchaseOrder.totalAmount;
    purchaseOrderToUpdate.status = purchaseOrder.status;

    if (purchaseOrder.voucher) {
      purchaseOrderToUpdate.voucher = purchaseOrder.voucher.id;
    }

    purchaseOrderToUpdate.items = purchaseOrder.items.map(({ id }) => id);

    await purchaseOrderToUpdate.save();

    const populatedPurchaseOrder = await PurchaseOrderModel.populate(
      purchaseOrderToUpdate,
      { path: 'voucher', model: VoucherModel },
    );

    return this.mapPurchaseOrder(populatedPurchaseOrder);
  }

  public async addPurchaseOrderItem(purchaseOrderItem: PurchaseOrderItem): Promise<PurchaseOrderItem> {
    const createdPurchaseOrderItem = await PurchaseOrderItemModel.create({
      _id: purchaseOrderItem.id,
      purchaseOrder: purchaseOrderItem.purchaseOrderId,
      quantity: purchaseOrderItem.quantity,
      product: purchaseOrderItem.product.id,
    });

    const populatedPurchaseOrderItem = await createdPurchaseOrderItem.populate({
      path: 'product', select: '_id name amount', model: ProductModel,
    });

    return this.mapPurchaseOrderItem(populatedPurchaseOrderItem);
  }

  public async updatePurchaseOrderItem(purchaseOrderItem: PurchaseOrderItem): Promise<PurchaseOrderItem> {
    const updatedPurchaseOrderItem = await PurchaseOrderItemModel.findOneAndUpdate(
      { id: purchaseOrderItem.id },
      { $set: { quantity: purchaseOrderItem.quantity } },
      {
        new: true,
        populate: {
          path: 'product',
          select: '_id name amount',
          model: ProductModel,
        },
      },
    );

    if (!updatedPurchaseOrderItem) {
      throw new RepositoryError(this.constructor.name, 'Item não encontrado.');
    }

    return this.mapPurchaseOrderItem(updatedPurchaseOrderItem);
  }

  public async deletePurchaseOrderItem(purchaseOrderItemId: string): Promise<boolean> {
    try {
      const result = await PurchaseOrderItemModel.deleteOne({ _id: purchaseOrderItemId });

      return result.deletedCount > 0;
    } catch (e: any) {
      console.error(e.stack);
      return false;
    }
  }

  private mapPurchaseOrder(purchaseOrder: IPurchaseOrder): PurchaseOrder {
    const params: PurchaseOrderParams = {
      id: purchaseOrder._id,
      customerId: purchaseOrder.customer,
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
      id: voucher._id,
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
      id: purchaseOrderItem._id,
      purchaseOrderId: String(purchaseOrderItem.purchaseOrder),
      quantity: purchaseOrderItem.quantity,
      product: new Product(
        product._id,
        product.name,
        product.amount,
      ),
    });
  }
}
