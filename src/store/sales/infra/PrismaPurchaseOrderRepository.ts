import {
  PrismaClient,
  PurchaseOrder as PrismaPurchaseOrder,
  Voucher as PrismaVoucher,
  PurchaseOrderItem as PrismaPurchaseOrderItem,
} from '@prisma/client';
import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import Product from '@sales/domain/Product';
import PurchaseOrder, { PurchaseOrderParams, PurchaseOrderStatus } from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import Voucher from '@sales/domain/Voucher';
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
  private connection: PrismaClient;

  constructor() {
    this.connection = Prisma.connect();
  }

  public async getPurchaseOrderById(id: string): Promise<PurchaseOrder | null> {
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
  }

  public async getPurchaseOrdersByClientId(id: string): Promise<PurchaseOrder[]> {
    const purchaseOrders = await this.connection.purchaseOrder.findMany({
      where: { clientId: id },
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

    return purchaseOrders.map(this.mapPurchaseOrder.bind(this));
  }

  public async getDraftPurchaseOrderByClientId(id: string): Promise<PurchaseOrder | null> {
    const purchaseOrder = await this.connection.purchaseOrder.findFirst({
      where: { clientId: id, status: PurchaseOrderStatus.DRAFT },
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
  }

  public async addPurchaseOrder(purchaseOrder: PurchaseOrder): Promise<PurchaseOrder> {
    const createdPurchaseOrder = await this.connection.purchaseOrder.create({
      data: {
        id: purchaseOrder.id,
        code: purchaseOrder.code,
        totalAmount: purchaseOrder.totalAmount,
        discountAmount: purchaseOrder.discountAmount,
        status: purchaseOrder.status,
        clientId: purchaseOrder.clientId,
        voucherId: purchaseOrder.voucher ? purchaseOrder.voucher.id : undefined,
        createdAt: purchaseOrder.createdAt,
      },
      include: {
        voucher: true,
      },
    });

    return this.mapPurchaseOrder(createdPurchaseOrder);
  }

  public async updatePurchaseOrder(purchaseOrder: PurchaseOrder): Promise<PurchaseOrder> {
    const updatedPurchaseOrder = await this.connection.purchaseOrder.update({
      where: { id: purchaseOrder.id },
      data: {
        clientId: purchaseOrder.clientId,
        code: purchaseOrder.code,
        totalAmount: purchaseOrder.totalAmount,
        discountAmount: purchaseOrder.discountAmount,
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

    return this.mapPurchaseOrder(updatedPurchaseOrder);
  }

  public async getPurchaseOrderItemById(id: string): Promise<PurchaseOrderItem | null> {
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

  private mapVoucher(voucher: PrismaVoucher) {
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

  private mapPurchaseOrderItem(purchaseOrderItem: ItemWithProduct) {
    return new PurchaseOrderItem({
      id: purchaseOrderItem.id,
      quantity: purchaseOrderItem.quantity,
      purchaseOrderId: purchaseOrderItem.purchaseOrderId,
      product: new Product(
        purchaseOrderItem.product.id,
        purchaseOrderItem.product.name,
        purchaseOrderItem.product.amount,
      ),
    });
  }
}
