/* eslint-disable max-len */
import Product from '@sales/domain/Product';
import { faker } from '@faker-js/faker';
import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import PurchaseOrder, { PurchaseOrderStatus } from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import Voucher, { VoucherDiscountTypes } from '@sales/domain/Voucher';

export class RepositoryStub implements IPurchaseOrderRepository {
  getPurchaseOrderById(_: string): Promise<PurchaseOrder | null> {
    return Promise.resolve(
      new PurchaseOrder({
        customerId: faker.datatype.uuid(),
        code: parseInt(faker.random.numeric(), 10),
        createdAt: new Date(),
        id: faker.datatype.uuid(),
        status: PurchaseOrderStatus.STARTED,
        voucher: null,
      }),
    );
  }

  getPurchaseOrdersByCustomerId(_: string): Promise<PurchaseOrder[]> {
    return Promise.resolve([
      new PurchaseOrder({
        customerId: faker.datatype.uuid(),
        code: parseInt(faker.random.numeric(), 10),
        createdAt: new Date(),
        id: faker.datatype.uuid(),
        status: PurchaseOrderStatus.STARTED,
        voucher: null,
      }),
    ]);
  }

  getDraftPurchaseOrderByCustomerId(_: string): Promise<PurchaseOrder | null> {
    return Promise.resolve(
      new PurchaseOrder({
        customerId: faker.datatype.uuid(),
        code: parseInt(faker.random.numeric(), 10),
        createdAt: new Date(),
        id: faker.datatype.uuid(),
        status: PurchaseOrderStatus.DRAFT,
        voucher: null,
      }),
    );
  }

  addPurchaseOrder(_: PurchaseOrder): Promise<void> {
    return Promise.resolve();
  }

  updatePurchaseOrder(_: PurchaseOrder): Promise<void> {
    return Promise.resolve();
  }

  getPurchaseOrderItemById(_: string): Promise<PurchaseOrderItem | null> {
    return Promise.resolve(
      new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        purchaseOrderId: faker.datatype.uuid(),
        product: new Product(
          faker.datatype.uuid(),
          faker.commerce.product(),
          faker.datatype.float(),
        ),
      }),
    );
  }

  getPurchaseOrderItem(_: { purchaseOrderId: string; }): Promise<PurchaseOrderItem | null>;

  getPurchaseOrderItem(_: { productId: string; }): Promise<PurchaseOrderItem | null>;

  getPurchaseOrderItem(_: { purchaseOrderId?: string | undefined; productId?: string | undefined; }): Promise<PurchaseOrderItem | null>;

  getPurchaseOrderItem(_: unknown): Promise<PurchaseOrderItem | null> {
    return Promise.resolve(
      new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        purchaseOrderId: faker.datatype.uuid(),
        product: new Product(
          faker.datatype.uuid(),
          faker.commerce.product(),
          faker.datatype.float(),
        ),
      }),
    );
  }

  addPurchaseOrderItem(_: PurchaseOrderItem): Promise<void> {
    return Promise.resolve();
  }

  updatePurchaseOrderItem(_: PurchaseOrderItem): Promise<void> {
    return Promise.resolve();
  }

  deletePurchaseOrderItem(_: string): Promise<void> {
    return Promise.resolve();
  }

  getVoucherByCode(_: number): Promise<Voucher | null> {
    return Promise.resolve(
      new Voucher({
        id: faker.datatype.uuid(),
        percentageAmount: 0,
        rawDiscountAmount: 0,
        quantity: parseInt(faker.datatype.number().toString(), 10),
        type: VoucherDiscountTypes.ABSOLUTE,
        active: true,
        code: parseInt(faker.datatype.number().toString(), 10),
        expiresAt: faker.date.future(),
        createdAt: new Date(),
        usedAt: null,
      }),
    );
  }

  countPurchaseOrders(): Promise<number> {
    return Promise.resolve(parseInt(faker.datatype.number().toString(), 10));
  }

  countPurchaseOrderItems(): Promise<number> {
    return Promise.resolve(parseInt(faker.datatype.number().toString(), 10));
  }

  countVouchers(): Promise<number> {
    return Promise.resolve(parseInt(faker.datatype.number().toString(), 10));
  }
}

export default new RepositoryStub();
