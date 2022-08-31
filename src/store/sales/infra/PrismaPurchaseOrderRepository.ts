import {
  PrismaClient,
  PurchaseOrder as PrismaPurchaseOrder,
  Voucher as PrismaVoucher,
  PurchaseOrderItem as PrismaPurchaseOrderItem,
  Product as PrismaProduct,
} from '@prisma/client';
import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import Product from '@sales/domain/Product';
import PurchaseOrder, { PurchaseOrderParams, PurchaseOrderStatus } from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import Voucher from '@sales/domain/Voucher';
import Prisma from '@shared/Prisma';

type ItemsWithProduct = Array<PrismaPurchaseOrderItem & {
  product: {
    id: string;
    name: string;
    amount: number;
  }
}>;

type PurchaseOrderWithVoucherAndItems = PrismaPurchaseOrder & {
  voucher: PrismaVoucher;
  items: ItemsWithProduct;
};

export default class PrismaPurchaseOrderRepository implements IPurchaseOrderRepository {
  private connection: PrismaClient;

  constructor() {
    this.connection = Prisma.connect();
  }

  public async getPurchaseOrderById(id: string): Promise<PurchaseOrder | null> {
    const purchaseOrder = await this.connection.purchaseOrder.findUnique({
      where: { id },
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
        voucher: true,
      },
    });

    return purchaseOrder ? this.mapPurchaseOrder(purchaseOrder) : null;
  }

  public getPurchaseOrdersByClientId(id: string): Promise<PurchaseOrder[]> {
    throw new Error('Method not implemented.');
  }

  public getDraftPurchaseOrderByClientId(id: string): Promise<PurchaseOrder | null> {
    throw new Error('Method not implemented.');
  }

  public addPurchaseOrder(purchaseOrder: PurchaseOrder): Promise<PurchaseOrder> {
    throw new Error('Method not implemented.');
  }

  public updatePurchaseOrder(purchaseOrder: PurchaseOrder): Promise<PurchaseOrder> {
    throw new Error('Method not implemented.');
  }

  public getPurchaseOrderItemById(id: string): Promise<PurchaseOrderItem | null> {
    throw new Error('Method not implemented.');
  }

  public getPurchaseOrderItem(
    purchaseOrderId: string,
    productId: string,
  ): Promise<PurchaseOrderItem | null> {
    throw new Error('Method not implemented.');
  }

  public addPurchaseOrderItem(purchaseOrderItem: PurchaseOrderItem): Promise<PurchaseOrderItem> {
    throw new Error('Method not implemented.');
  }

  public updatePurchaseOrderItem(purchaseOrderItem: PurchaseOrderItem): Promise<PurchaseOrderItem> {
    throw new Error('Method not implemented.');
  }

  public deletePurchaseOrderItem(purchaseOrderItem: PurchaseOrderItem): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  public getVoucherByCode(code: string): Promise<Voucher | null> {
    throw new Error('Method not implemented.');
  }

  private mapPurchaseOrder(purchaseOrder: PurchaseOrderWithVoucherAndItems) {
    const params: PurchaseOrderParams = {
      id: purchaseOrder.id,
      clientId: purchaseOrder.clientId,
      code: purchaseOrder.code,
      totalAmount: purchaseOrder.totalAmount,
      discountAmount: purchaseOrder.discountAmount,
      status: purchaseOrder.status as PurchaseOrderStatus,
      createdAt: purchaseOrder.createdAt,
      voucher: null,
    };

    if (purchaseOrder.voucher) {
      params.voucher = new Voucher({
        id: purchaseOrder.voucher.id,
        active: purchaseOrder.voucher.active,
        code: purchaseOrder.voucher.code,
        percentageAmount: purchaseOrder.voucher.percentageAmount,
        rawDiscountAmount: purchaseOrder.voucher.rawDiscountAmount,
        type: purchaseOrder.voucher.type,
        quantity: purchaseOrder.voucher.quantity,
        createdAt: purchaseOrder.voucher.createdAt,
        expiresAt: purchaseOrder.voucher.expiresAt,
        usedAt: purchaseOrder.voucher.usedAt,
      });
    }

    const po = new PurchaseOrder(params);

    purchaseOrder.items.forEach((item) => {
      po.addItem(new PurchaseOrderItem({
        id: item.id,
        quantity: item.quantity,
        purchaseOrderId: item.purchaseOrderId,
        product: new Product(
          item.product.id,
          item.product.name,
          item.product.amount,
        ),
      }));
    });

    return po;
  }
}
