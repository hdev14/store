/* eslint-disable max-len */
import { IPurchaseOrderRepositoryQueries, IPurchaseOrderRepositoryCommands } from '@sales/domain/IPurchaseOrderRepository';
import Product from '@sales/domain/Product';
import PurchaseOrder, { PurchaseOrderParams, PurchaseOrderStatus } from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import Voucher from '@sales/domain/Voucher';
import RepositoryError from '@shared/errors/RepositoryError';
import ProductModel, { IProduct } from '@mongoose/models/ProductModel';
import PurchaseOrderItemModel, { IPurchaseOrderItem } from '@mongoose/models/PurchaseOrderItemModel';
import PurchaseOrderModel, { IPurchaseOrder } from '@mongoose/models/PurchaseOrderModel';
import VoucherModel, { IVoucher } from '@mongoose/models/VoucherModel';

export default class MongoosePurchaseOrderRepository implements IPurchaseOrderRepositoryQueries, IPurchaseOrderRepositoryCommands {
  public async getPurchaseOrderById(id: string): Promise<PurchaseOrder | null> {
    try {
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
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async getPurchaseOrdersByCustomerId(id: string): Promise<PurchaseOrder[]> {
    try {
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
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async getDraftPurchaseOrderByCustomerId(id: string): Promise<PurchaseOrder | null> {
    try {
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
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async getPurchaseOrderItemById(id: string): Promise<PurchaseOrderItem | null> {
    try {
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
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async getPurchaseOrderItem(params: { purchaseOrderId: string, productId: string }): Promise<PurchaseOrderItem | null> {
    try {
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
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async getVoucherByCode(code: number): Promise<Voucher | null> {
    try {
      const voucher = await VoucherModel.findOne({ code });

      return voucher ? this.mapVoucher(voucher) : null;
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async addPurchaseOrder(purchaseOrder: PurchaseOrder): Promise<void> {
    try {
      await PurchaseOrderModel.create({
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
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async updatePurchaseOrder(purchaseOrder: PurchaseOrder): Promise<void> {
    try {
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
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async addPurchaseOrderItem(purchaseOrderItem: PurchaseOrderItem): Promise<void> {
    try {
      await PurchaseOrderItemModel.create({
        _id: purchaseOrderItem.id,
        purchaseOrder: purchaseOrderItem.purchaseOrderId,
        quantity: purchaseOrderItem.quantity,
        product: purchaseOrderItem.product.id,
      });
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async updatePurchaseOrderItem(purchaseOrderItem: PurchaseOrderItem): Promise<void> {
    try {
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
        throw new Error('Item não encontrado.');
      }
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async deletePurchaseOrderItem(purchaseOrderItemId: string): Promise<void> {
    try {
      const result = await PurchaseOrderItemModel.deleteOne({ _id: purchaseOrderItemId });

      if (result.deletedCount === 0) {
        throw new Error('Item não excluído');
      }
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
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

    for (let i = 0, len = purchaseOrder.items.length; i < len; i += 1) {
      po.addItem(this.mapPurchaseOrderItem(purchaseOrder.items[i] as unknown as IPurchaseOrderItem));
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
