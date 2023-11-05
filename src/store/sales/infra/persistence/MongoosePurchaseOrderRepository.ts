/* eslint-disable max-len */
import ProductModel, { IProduct } from '@db/mongoose/models/ProductModel';
import PurchaseOrderItemModel, { IPurchaseOrderItem } from '@db/mongoose/models/PurchaseOrderItemModel';
import PurchaseOrderModel, { IPurchaseOrder } from '@db/mongoose/models/PurchaseOrderModel';
import VoucherModel, { IVoucher } from '@db/mongoose/models/VoucherModel';
import { IPurchaseOrderRepositoryCommands, IPurchaseOrderRepositoryQueries } from '@sales/domain/IPurchaseOrderRepository';
import PurchaseOrder, { PurchaseOrderProps, PurchaseOrderStatus } from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import Voucher from '@sales/domain/Voucher';
import RepositoryError from '@shared/errors/RepositoryError';

export default class MongoosePurchaseOrderRepository implements IPurchaseOrderRepositoryQueries, IPurchaseOrderRepositoryCommands {
  public async getPurchaseOrderById(id: string): Promise<PurchaseOrder | null> {
    try {
      const purchase_order = await PurchaseOrderModel
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

      return purchase_order ? this.mapPurchaseOrder(purchase_order) : null;
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async getPurchaseOrdersByCustomerId(id: string): Promise<PurchaseOrder[]> {
    try {
      const purchase_orders = await PurchaseOrderModel.find({ customer: id })
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

      const results: PurchaseOrder[] = [];

      for (const purchaseOrder of purchase_orders) {
        results.push(this.mapPurchaseOrder(purchaseOrder));
      }

      return results;
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async getDraftPurchaseOrderByCustomerId(id: string): Promise<PurchaseOrder | null> {
    try {
      const purchase_order = await PurchaseOrderModel
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

      return purchase_order ? this.mapPurchaseOrder(purchase_order) : null;
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async getPurchaseOrderItemById(id: string): Promise<PurchaseOrderItem | null> {
    try {
      const purchase_order_item = await PurchaseOrderItemModel.findOne(
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

      return purchase_order_item ? this.mapPurchaseOrderItem(purchase_order_item) : null;
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async getPurchaseOrderItem(params: { purchase_order_id: string, product_id: string }): Promise<PurchaseOrderItem | null> {
    try {
      const purchaseOrderItem = await PurchaseOrderItemModel.findOne(
        { product: params.product_id, purchaseOrder: params.purchase_order_id },
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

  public async addPurchaseOrder(purchase_order: PurchaseOrder): Promise<void> {
    try {
      await PurchaseOrderModel.create({
        _id: purchase_order.id,
        customer: purchase_order.customer_id,
        items: purchase_order.items.map(({ id }) => id),
        voucher: purchase_order.voucher ? purchase_order.voucher.id : undefined,
        code: purchase_order.code,
        totalAmount: purchase_order.total_amount,
        discountAmount: purchase_order.discount_amount,
        status: purchase_order.status,
        createdAt: purchase_order.created_at,
      });
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async updatePurchaseOrder(purchase_order: PurchaseOrder): Promise<void> {
    try {
      const purchase_order_to_update = await PurchaseOrderModel.findOne(
        { _id: purchase_order.id },
      );

      if (!purchase_order_to_update) {
        throw new Error('PurchaseOrder not found');
      }

      purchase_order_to_update.code = purchase_order.code;
      purchase_order_to_update.discountAmount = purchase_order.discount_amount;
      purchase_order_to_update.totalAmount = purchase_order.total_amount;
      purchase_order_to_update.status = purchase_order.status;

      if (purchase_order.voucher) {
        purchase_order_to_update.voucher = purchase_order.voucher.id;
      }

      purchase_order_to_update.items = purchase_order.items.map(({ id }) => id);

      await purchase_order_to_update.save();
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async addPurchaseOrderItem(purchase_order_item: PurchaseOrderItem): Promise<void> {
    try {
      await PurchaseOrderItemModel.create({
        _id: purchase_order_item.id,
        purchaseOrder: purchase_order_item.purchase_order_id,
        quantity: purchase_order_item.quantity,
        product: purchase_order_item.product.id,
      });
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async updatePurchaseOrderItem(purchase_order_item: PurchaseOrderItem): Promise<void> {
    try {
      const updated_purchase_order_item = await PurchaseOrderItemModel.findOneAndUpdate(
        { id: purchase_order_item.id },
        { $set: { quantity: purchase_order_item.quantity } },
        {
          new: true,
          populate: {
            path: 'product',
            select: '_id name amount',
            model: ProductModel,
          },
        },
      );

      if (!updated_purchase_order_item) {
        throw new Error('Item não encontrado.');
      }
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async deletePurchaseOrderItem(purchase_order_item_id: string): Promise<void> {
    try {
      const result = await PurchaseOrderItemModel.deleteOne({ _id: purchase_order_item_id });

      if (result.deletedCount === 0) {
        throw new Error('Item não excluído');
      }
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  private mapPurchaseOrder(purchase_order: IPurchaseOrder): PurchaseOrder {
    const params: PurchaseOrderProps = {
      id: purchase_order._id,
      customer_id: purchase_order.customer,
      code: purchase_order.code,
      total_amount: purchase_order.totalAmount,
      discount_amount: purchase_order.discountAmount,
      status: purchase_order.status as PurchaseOrderStatus,
      created_at: purchase_order.createdAt,
      voucher: purchase_order.voucher
        ? this.mapVoucher(purchase_order.voucher as unknown as IVoucher)
        : null,
      items: [],
    };

    const po = new PurchaseOrder(params);

    for (let i = 0, len = purchase_order.items.length; i < len; i += 1) {
      po.addItem(this.mapPurchaseOrderItem(purchase_order.items[i] as unknown as IPurchaseOrderItem));
    }

    return po;
  }

  private mapVoucher(voucher: IVoucher) {
    return new Voucher({
      id: voucher._id,
      active: voucher.active,
      code: voucher.code,
      percentage_amount: voucher.percentageAmount,
      raw_discount_amount: voucher.rawDiscountAmount,
      type: voucher.type,
      quantity: voucher.quantity,
      created_at: voucher.createdAt,
      expires_at: voucher.expiresAt,
      usedAt: voucher.usedAt,
    });
  }

  private mapPurchaseOrderItem(purchase_order_item: IPurchaseOrderItem) {
    const product = purchase_order_item.product as unknown as IProduct;

    return new PurchaseOrderItem({
      id: purchase_order_item._id,
      purchase_order_id: String(purchase_order_item.purchaseOrder),
      quantity: purchase_order_item.quantity,
      product: {
        ...product,
        id: product._id,
      },
    });
  }
}
