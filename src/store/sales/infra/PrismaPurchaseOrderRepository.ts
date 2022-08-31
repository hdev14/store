import { PrismaClient } from '@prisma/client';
import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import Voucher from '@sales/domain/Voucher';
import Prisma from '@shared/Prisma';

export default class PrismaPurchaseOrderRepository implements IPurchaseOrderRepository {
  private connection: PrismaClient;

  constructor() {
    this.connection = Prisma.connect();
  }

  public getPurchaseOrderById(id: string): Promise<PurchaseOrder | null> {
    throw new Error('Method not implemented.');
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
}
