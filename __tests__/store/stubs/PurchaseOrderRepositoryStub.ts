import { faker } from '@faker-js/faker';
import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import PurchaseOrder, { PurchaseOrderStatus } from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import Voucher, { VoucherDiscountTypes } from '@sales/domain/Voucher';

export class RepositoryStub implements IPurchaseOrderRepository {
  getPurchaseOrderItem(params: { purchase_order_id: string; product_id: string; }): Promise<PurchaseOrderItem | null> {
    return Promise.resolve(
      new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        purchase_order_id: faker.datatype.uuid(),
        product: {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          amount: faker.datatype.float(),
        },
      }),
    );
  }

  getPurchaseOrderById(_: string): Promise<PurchaseOrder | null> {
    return Promise.resolve(
      new PurchaseOrder({
        customer_id: faker.datatype.uuid(),
        code: parseInt(faker.random.numeric(), 10),
        created_at: new Date(),
        id: faker.datatype.uuid(),
        status: PurchaseOrderStatus.STARTED,
        voucher: null,
        items: [],
      }),
    );
  }

  getPurchaseOrdersByCustomerId(_: string): Promise<PurchaseOrder[]> {
    return Promise.resolve([
      new PurchaseOrder({
        customer_id: faker.datatype.uuid(),
        code: parseInt(faker.random.numeric(), 10),
        created_at: new Date(),
        id: faker.datatype.uuid(),
        status: PurchaseOrderStatus.STARTED,
        voucher: null,
        items: [],
      }),
    ]);
  }

  getDraftPurchaseOrderByCustomerId(_: string): Promise<PurchaseOrder | null> {
    return Promise.resolve(
      new PurchaseOrder({
        customer_id: faker.datatype.uuid(),
        code: parseInt(faker.random.numeric(), 10),
        created_at: new Date(),
        id: faker.datatype.uuid(),
        status: PurchaseOrderStatus.DRAFT,
        voucher: null,
        items: [],
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
        purchase_order_id: faker.datatype.uuid(),
        product: {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          amount: faker.datatype.float(),
        },
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
        percentage_amount: 0,
        raw_discount_amount: 0,
        quantity: parseInt(faker.datatype.number().toString(), 10),
        type: VoucherDiscountTypes.ABSOLUTE,
        active: true,
        code: parseInt(faker.datatype.number().toString(), 10),
        expires_at: faker.date.future(),
        created_at: new Date(),
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
