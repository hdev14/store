/* eslint-disable max-len */
import {
    PrismaClient,
    PurchaseOrder as PrismaPurchaseOrder,
    PurchaseOrderItem as PrismaPurchaseOrderItem,
    Voucher as PrismaVoucher,
} from '@prisma/client';
import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import PurchaseOrder, { PurchaseOrderProps, PurchaseOrderStatus } from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import Voucher from '@sales/domain/Voucher';
import RepositoryError from '@shared/errors/RepositoryError';
import Prisma from '@shared/Prisma';

type ItemWithProduct = PrismaPurchaseOrderItem & {
  product: {
    id: string;
    name: string;
    amount: number;
  }
};

type PurchaseOrderWithVoucherAndItems = PrismaPurchaseOrder & {
  voucher?: PrismaVoucher | null;
  items?: Array<ItemWithProduct>;
};

export default class PrismaPurchaseOrderRepository implements IPurchaseOrderRepository {
  private readonly connection: PrismaClient;

  constructor() {
    this.connection = Prisma.connect();
  }

  public async getPurchaseOrderById(id: string): Promise<PurchaseOrder | null> {
    try {
      const purchaseOrder = await this.connection.purchaseOrder.findUnique({
        where: { id },
        include: {
          voucher: true,
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  amount: true,
                },
              },
            },
          },
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
      const purchaseOrders = await this.connection.purchaseOrder.findMany({
        where: { customerId: id },
        include: {
          voucher: true,
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  amount: true,
                },
              },
            },
          },
        },
      });

      const results: PurchaseOrder[] = [];

      for (const purchaseOrder of purchaseOrders) {
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
      const purchaseOrder = await this.connection.purchaseOrder.findFirst({
        where: { customerId: id, status: PurchaseOrderStatus.DRAFT },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  amount: true,
                },
              },
            },
          },
        },
      });

      return purchaseOrder ? this.mapPurchaseOrder(purchaseOrder) : null;
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async addPurchaseOrder(purchaseOrder: PurchaseOrder): Promise<void> {
    try {
      await this.connection.purchaseOrder.create({
        data: {
          id: purchaseOrder.id,
          code: purchaseOrder.code,
          totalAmount: purchaseOrder.total_amount,
          discountAmount: purchaseOrder.discount_amount,
          status: purchaseOrder.status,
          customerId: purchaseOrder.customer_id,
          voucherId: purchaseOrder.voucher ? purchaseOrder.voucher.id : undefined,
          createdAt: purchaseOrder.created_at,
        },
        include: {
          voucher: true,
        },
      });
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async updatePurchaseOrder(purchaseOrder: PurchaseOrder): Promise<void> {
    try {
      await this.connection.purchaseOrder.update({
        where: { id: purchaseOrder.id },
        data: {
          customerId: purchaseOrder.customer_id,
          code: purchaseOrder.code,
          totalAmount: purchaseOrder.total_amount,
          discountAmount: purchaseOrder.discount_amount,
          status: purchaseOrder.status,
          voucherId: purchaseOrder.voucher ? purchaseOrder.voucher.id : undefined,
        },
        include: {
          voucher: true,
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  amount: true,
                },
              },
            },
          },
        },
      });
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async getPurchaseOrderItemById(id: string): Promise<PurchaseOrderItem | null> {
    try {
      const purchaseOrderItem = await this.connection.purchaseOrderItem.findUnique({
        where: { id },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              amount: true,
            },
          },
        },
      });

      return purchaseOrderItem ? this.mapPurchaseOrderItem(purchaseOrderItem) : null;
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async getPurchaseOrderItem(params: { purchaseOrderId: string; productId: string; }): Promise<PurchaseOrderItem | null> {
    try {
      const purchaseOrderItem = await this.connection.purchaseOrderItem.findFirst({
        where: params,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              amount: true,
            },
          },
        },
      });

      return purchaseOrderItem ? this.mapPurchaseOrderItem(purchaseOrderItem) : null;
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async addPurchaseOrderItem(purchaseOrderItem: PurchaseOrderItem): Promise<void> {
    try {
      await this.connection.purchaseOrderItem.create({
        data: {
          id: purchaseOrderItem.id,
          purchaseOrderId: purchaseOrderItem.purchase_order_id,
          quantity: purchaseOrderItem.quantity,
          productId: purchaseOrderItem.product.id,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              amount: true,
            },
          },
        },
      });
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async updatePurchaseOrderItem(purchaseOrderItem: PurchaseOrderItem): Promise<void> {
    try {
      await this.connection.purchaseOrderItem.update({
        where: { id: purchaseOrderItem.id },
        data: {
          purchaseOrderId: purchaseOrderItem.purchase_order_id,
          quantity: purchaseOrderItem.quantity,
          productId: purchaseOrderItem.product.id,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              amount: true,
            },
          },
        },
      });
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async deletePurchaseOrderItem(purchaseOrderItemId: string): Promise<void> {
    try {
      await this.connection.purchaseOrderItem.delete({
        where: { id: purchaseOrderItemId },
      });
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async getVoucherByCode(code: number): Promise<Voucher | null> {
    try {
      const voucher = await this.connection.voucher.findFirst({
        where: { code },
      });

      return voucher ? this.mapVoucher(voucher) : null;
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async countPurchaseOrders(): Promise<number> {
    try {
      return this.connection.purchaseOrder.count();
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async countPurchaseOrderItems(): Promise<number> {
    try {
      return this.connection.purchaseOrderItem.count();
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async countVouchers(): Promise<number> {
    try {
      return this.connection.voucher.count();
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  private mapPurchaseOrder(purchaseOrder: PurchaseOrderWithVoucherAndItems) {
    const props: PurchaseOrderProps = {
      id: purchaseOrder.id,
      customer_id: purchaseOrder.customerId,
      code: purchaseOrder.code,
      total_amount: purchaseOrder.totalAmount,
      discount_amount: purchaseOrder.discountAmount,
      status: purchaseOrder.status as PurchaseOrderStatus,
      created_at: purchaseOrder.createdAt,
      voucher: purchaseOrder.voucher ? this.mapVoucher(purchaseOrder.voucher) : null,
      items: [],
    };

    const po = new PurchaseOrder(props);

    if (purchaseOrder.items) {
      for (let i = 0, len = purchaseOrder.items.length; i < len; i += 1) {
        po.addItem(this.mapPurchaseOrderItem(purchaseOrder.items[i]));
      }
    }

    return po;
  }

  private mapVoucher(voucher: PrismaVoucher) {
    return new Voucher({
      id: voucher.id,
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

  private mapPurchaseOrderItem(purchaseOrderItem: ItemWithProduct) {
    return new PurchaseOrderItem({
      id: purchaseOrderItem.id,
      quantity: purchaseOrderItem.quantity,
      purchase_order_id: purchaseOrderItem.purchaseOrderId,
      product: purchaseOrderItem.product,
    });
  }
}
