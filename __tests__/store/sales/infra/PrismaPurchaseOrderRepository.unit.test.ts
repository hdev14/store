import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import Product from '@sales/domain/Product';
import PurchaseOrder, { PurchaseOrderStatus } from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import { VoucherDiscountTypes } from '@sales/domain/Voucher';
import PrismaPurchaseOrderRepository from '@sales/infra/persistence/PrismaPurchaseOrderRepository';
import RepositoryError from '@shared/errors/RepositoryError';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';

const prismaMock = mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>;

jest.mock('@prisma/client/index', () => ({
  PrismaClient: jest.fn().mockImplementation(() => prismaMock),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

describe("PrismaPurchaseOrderRepository's unit tests", () => {
  const repository = new PrismaPurchaseOrderRepository();

  describe('PrismaPurchaseOrderRepository.getPurchaseOrderById()', () => {
    it('returns a purchase order by id', async () => {
      expect.assertions(28);

      const purchaseOrderId = faker.datatype.uuid();

      const fakePurchaseOrder = {
        id: purchaseOrderId,
        customerId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        status: PurchaseOrderStatus.STARTED,
        totalAmount: faker.datatype.float(),
        discountAmount: 0,
        createdAt: new Date(),
        voucher: {
          id: faker.datatype.uuid(),
          percentageAmount: 0,
          rawDiscountAmount: 0,
          quantity: parseInt(faker.datatype.number().toString(), 10),
          type: VoucherDiscountTypes.ABSOLUTE,
          active: faker.datatype.boolean(),
          code: parseInt(faker.datatype.number().toString(), 10),
          expiresAt: new Date(),
          createdAt: new Date(),
        },
        items: [
          {
            id: faker.datatype.uuid(),
            quantity: parseInt(faker.datatype.number().toString(), 10),
            purchaseOrderId,
            product: {
              id: faker.datatype.uuid(),
              name: faker.commerce.product(),
              amount: faker.datatype.float(),
            },
          },
          {
            id: faker.datatype.uuid(),
            quantity: parseInt(faker.datatype.number().toString(), 10),
            purchaseOrderId,
            product: {
              id: faker.datatype.uuid(),
              name: faker.commerce.product(),
              amount: faker.datatype.float(),
            },
          },
        ],
      };

      prismaMock.purchaseOrder.findUnique.mockResolvedValueOnce(fakePurchaseOrder as any);

      const purchaseOrder = await repository.getPurchaseOrderById(purchaseOrderId);

      expect(purchaseOrder!.id).toEqual(fakePurchaseOrder.id);
      expect(purchaseOrder!.customer_id).toEqual(fakePurchaseOrder.customerId);
      expect(purchaseOrder!.code).toEqual(fakePurchaseOrder.code);
      expect(purchaseOrder!.created_at).toEqual(fakePurchaseOrder.createdAt);
      expect(purchaseOrder!.discount_amount).toEqual(fakePurchaseOrder.discountAmount);
      expect(purchaseOrder!.voucher!.id).toEqual(fakePurchaseOrder.voucher.id);
      expect(purchaseOrder!.voucher!.active).toEqual(fakePurchaseOrder.voucher.active);
      expect(purchaseOrder!.voucher!.code).toEqual(fakePurchaseOrder.voucher.code);
      expect(purchaseOrder!.voucher!.type).toEqual(fakePurchaseOrder.voucher.type);
      expect(purchaseOrder!.voucher!.percentage_amount)
        .toEqual(fakePurchaseOrder.voucher.percentageAmount);
      expect(purchaseOrder!.voucher!.raw_discount_amount)
        .toEqual(fakePurchaseOrder.voucher.rawDiscountAmount);
      expect(purchaseOrder!.voucher!.created_at).toEqual(fakePurchaseOrder.voucher.createdAt);
      expect(purchaseOrder!.voucher!.expires_at).toEqual(fakePurchaseOrder.voucher.expiresAt);
      expect(purchaseOrder!.voucher!.usedAt).toEqual(null);

      for (let i = 0, len = purchaseOrder!.items.length; i < len; i += 1) {
        const item = purchaseOrder!.items[i];
        expect(item.id).toEqual(fakePurchaseOrder.items[i].id);
        expect(item.product.id).toEqual(fakePurchaseOrder.items[i].product.id);
        expect(item.product.name).toEqual(fakePurchaseOrder.items[i].product.name);
        expect(item.product.amount).toEqual(fakePurchaseOrder.items[i].product.amount);
        expect(item.quantity).toEqual(fakePurchaseOrder.items[i].quantity);
        expect(item.purchase_order_id).toEqual(fakePurchaseOrder.items[i].purchaseOrderId);
      }

      expect(prismaMock.purchaseOrder.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.purchaseOrder.findUnique).toHaveBeenCalledWith({
        where: { id: purchaseOrderId },
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
    });

    it('throws a RepositoryError if occur an unexpected error', () => {
      expect.assertions(2);

      const purchaseOrderId = faker.datatype.uuid();

      prismaMock.purchaseOrder.findUnique.mockRejectedValueOnce(new Error('test'));

      return repository.getPurchaseOrderById(purchaseOrderId).catch((e: any) => {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaPurchaseOrderRepository - test');
      });
    });
  });

  describe('PrismaPurchaseOrderRepository.getPurchaseOrdersByCustomerId()', () => {
    it('returns purchase orders by client id', async () => {
      expect.assertions(28);

      const customerId = faker.datatype.uuid();
      const purchaseOrderId = faker.datatype.uuid();

      const fakePurchaseOrders = [{
        id: purchaseOrderId,
        customerId,
        code: parseInt(faker.datatype.number().toString(), 10),
        status: PurchaseOrderStatus.STARTED,
        totalAmount: faker.datatype.float(),
        discountAmount: 0,
        createdAt: new Date(),
        voucher: {
          id: faker.datatype.uuid(),
          percentageAmount: 0,
          rawDiscountAmount: 0,
          quantity: parseInt(faker.datatype.number().toString(), 10),
          type: VoucherDiscountTypes.ABSOLUTE,
          active: faker.datatype.boolean(),
          code: parseInt(faker.datatype.number().toString(), 10),
          expiresAt: new Date(),
          createdAt: new Date(),
        },
        items: [
          {
            id: faker.datatype.uuid(),
            quantity: parseInt(faker.datatype.number().toString(), 10),
            purchaseOrderId,
            product: {
              id: faker.datatype.uuid(),
              name: faker.commerce.product(),
              amount: faker.datatype.float(),
            },
          },
          {
            id: faker.datatype.uuid(),
            quantity: parseInt(faker.datatype.number().toString(), 10),
            purchaseOrderId,
            product: {
              id: faker.datatype.uuid(),
              name: faker.commerce.product(),
              amount: faker.datatype.float(),
            },
          },
        ],
      }];

      prismaMock.purchaseOrder.findMany.mockResolvedValueOnce(fakePurchaseOrders as any);

      const purchaseOrders = await repository.getPurchaseOrdersByCustomerId(customerId);

      for (let i = 0, poLength = purchaseOrders.length; i < poLength; i += 1) {
        const purchaseOrder = purchaseOrders[i];

        expect(purchaseOrder!.id).toEqual(fakePurchaseOrders[i].id);
        expect(purchaseOrder!.customer_id).toEqual(fakePurchaseOrders[i].customerId);
        expect(purchaseOrder!.code).toEqual(fakePurchaseOrders[i].code);
        expect(purchaseOrder!.created_at).toEqual(fakePurchaseOrders[i].createdAt);
        expect(purchaseOrder!.discount_amount).toEqual(fakePurchaseOrders[i].discountAmount);
        expect(purchaseOrder!.voucher!.id).toEqual(fakePurchaseOrders[i].voucher.id);
        expect(purchaseOrder!.voucher!.active).toEqual(fakePurchaseOrders[i].voucher.active);
        expect(purchaseOrder!.voucher!.code).toEqual(fakePurchaseOrders[i].voucher.code);
        expect(purchaseOrder!.voucher!.type).toEqual(fakePurchaseOrders[i].voucher.type);
        expect(purchaseOrder!.voucher!.percentage_amount)
          .toEqual(fakePurchaseOrders[i].voucher.percentageAmount);
        expect(purchaseOrder!.voucher!.raw_discount_amount)
          .toEqual(fakePurchaseOrders[i].voucher.rawDiscountAmount);
        expect(purchaseOrder!.voucher!.created_at)
          .toEqual(fakePurchaseOrders[i].voucher.createdAt);
        expect(purchaseOrder!.voucher!.expires_at)
          .toEqual(fakePurchaseOrders[i].voucher.expiresAt);
        expect(purchaseOrder!.voucher!.usedAt).toEqual(null);

        for (let h = 0, iLength = purchaseOrder!.items.length; h < iLength; h += 1) {
          const item = purchaseOrder!.items[h];
          expect(item.id).toEqual(fakePurchaseOrders[i].items[h].id);
          expect(item.product.id).toEqual(fakePurchaseOrders[i].items[h].product.id);
          expect(item.product.name).toEqual(fakePurchaseOrders[i].items[h].product.name);
          expect(item.product.amount).toEqual(fakePurchaseOrders[i].items[h].product.amount);
          expect(item.quantity).toEqual(fakePurchaseOrders[i].items[h].quantity);
          expect(item.purchase_order_id)
            .toEqual(fakePurchaseOrders[i].items[h].purchaseOrderId);
        }
      }

      expect(prismaMock.purchaseOrder.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.purchaseOrder.findMany).toHaveBeenCalledWith({
        where: { customerId },
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
    });

    it('throws a RepositoryError if occur an unexpected error', () => {
      expect.assertions(2);

      const customerId = faker.datatype.uuid();

      prismaMock.purchaseOrder.findMany.mockRejectedValueOnce(new Error('test'));

      return repository.getPurchaseOrdersByCustomerId(customerId).catch((e: any) => {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaPurchaseOrderRepository - test');
      });
    });
  });

  describe('PrismaPurchaseOrderRepository.getDraftPurchaseOrderByCustomerId()', () => {
    it('returns a draft purchase order by customer id', async () => {
      expect.assertions(13);

      const customerId = faker.datatype.uuid();
      const purchaseOrderId = faker.datatype.uuid();

      const fakeDraftPurchaseOrder = {
        id: purchaseOrderId,
        customerId,
        code: parseInt(faker.datatype.number().toString(), 10),
        status: PurchaseOrderStatus.DRAFT,
        totalAmount: 0,
        discountAmount: 0,
        createdAt: new Date(),
        voucher: null,
        items: [
          {
            id: faker.datatype.uuid(),
            quantity: parseInt(faker.datatype.number().toString(), 10),
            purchaseOrderId,
            product: {
              id: faker.datatype.uuid(),
              name: faker.commerce.product(),
              amount: faker.datatype.float(),
            },
          },
        ],
      };

      prismaMock.purchaseOrder.findFirst.mockResolvedValueOnce(fakeDraftPurchaseOrder as any);

      const purchaseOrder = await repository.getDraftPurchaseOrderByCustomerId(customerId);

      expect(purchaseOrder!.id).toEqual(fakeDraftPurchaseOrder.id);
      expect(purchaseOrder!.customer_id).toEqual(fakeDraftPurchaseOrder.customerId);
      expect(purchaseOrder!.code).toEqual(fakeDraftPurchaseOrder.code);
      expect(purchaseOrder!.created_at).toEqual(fakeDraftPurchaseOrder.createdAt);
      expect(purchaseOrder!.discount_amount).toEqual(fakeDraftPurchaseOrder.discountAmount);

      for (let i = 0, len = purchaseOrder!.items.length; i < len; i += 1) {
        const item = purchaseOrder!.items[i];

        expect(item.id).toEqual(fakeDraftPurchaseOrder.items[i].id);
        expect(item.product.id).toEqual(fakeDraftPurchaseOrder.items[i].product.id);
        expect(item.product.name).toEqual(fakeDraftPurchaseOrder.items[i].product.name);
        expect(item.product.amount).toEqual(fakeDraftPurchaseOrder.items[i].product.amount);
        expect(item.quantity).toEqual(fakeDraftPurchaseOrder.items[i].quantity);
        expect(item.purchase_order_id)
          .toEqual(fakeDraftPurchaseOrder.items[i].purchaseOrderId);
      }

      expect(prismaMock.purchaseOrder.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.purchaseOrder.findFirst).toHaveBeenCalledWith({
        where: { customerId, status: PurchaseOrderStatus.DRAFT },
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
    });

    it('throws a RepositoryError if occur an unexpected error', async () => {
      expect.assertions(2);

      const customerId = faker.datatype.uuid();

      prismaMock.purchaseOrder.findFirst.mockRejectedValueOnce(new Error('test'));

      return repository.getDraftPurchaseOrderByCustomerId(customerId).catch((e: any) => {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaPurchaseOrderRepository - test');
      });
    });
  });

  describe('PrismaPurchaseOrderRepository.addPurchaseOrder()', () => {
    it('calls prisma.purchaseOrder.create with correct params', async () => {
      expect.assertions(1);

      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        customer_id: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        status: PurchaseOrderStatus.DRAFT,
        voucher: {
          id: faker.datatype.uuid(),
          percentage_amount: 0,
          raw_discount_amount: 0,
          quantity: parseInt(faker.datatype.number().toString(), 10),
          type: VoucherDiscountTypes.ABSOLUTE,
          active: faker.datatype.boolean(),
          code: parseInt(faker.datatype.number().toString(), 10),
          expires_at: new Date(),
          created_at: new Date(),
          usedAt: null,
        },
        created_at: new Date(),
        items: [],
      });

      await repository.addPurchaseOrder(purchaseOrder);

      expect(prismaMock.purchaseOrder.create).toHaveBeenCalledWith({
        data: {
          id: purchaseOrder.id,
          customerId: purchaseOrder.customer_id,
          code: purchaseOrder.code,
          status: purchaseOrder.status,
          voucherId: purchaseOrder.voucher!.id,
          createdAt: purchaseOrder.created_at,
          totalAmount: purchaseOrder.total_amount,
          discountAmount: purchaseOrder.discount_amount,
        },
        include: {
          voucher: true,
        },
      });
    });

    it('calls prisma.purchaseOrder.create with correct params when voucher is null', async () => {
      expect.assertions(1);

      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        customer_id: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        status: PurchaseOrderStatus.DRAFT,
        total_amount: 0,
        discount_amount: 0,
        created_at: new Date(),
        voucher: null,
        items: [],
      });

      await repository.addPurchaseOrder(purchaseOrder);

      expect(prismaMock.purchaseOrder.create).toHaveBeenCalledWith({
        data: {
          id: purchaseOrder.id,
          customerId: purchaseOrder.customer_id,
          code: purchaseOrder.code,
          status: purchaseOrder.status,
          voucherId: undefined,
          createdAt: purchaseOrder.created_at,
          totalAmount: purchaseOrder.total_amount,
          discountAmount: purchaseOrder.discount_amount,
        },
        include: {
          voucher: true,
        },
      });
    });

    it('throws a RepositoryError if occur an unexpected error', async () => {
      expect.assertions(2);

      prismaMock.purchaseOrder.create.mockRejectedValueOnce(new Error('test'));

      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        customer_id: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        status: PurchaseOrderStatus.DRAFT,
        voucher: null,
        created_at: new Date(),
        items: [],
      });

      return repository.addPurchaseOrder(purchaseOrder).catch((e: any) => {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaPurchaseOrderRepository - test');
      });
    });
  });

  describe('PrismaPurchaseOrderRepository.updatePurchaseOrder()', () => {
    it('calls prisma.purchaseOrder.update method with correct params', async () => {
      expect.assertions(1);

      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        customer_id: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        status: PurchaseOrderStatus.DRAFT,
        total_amount: 0,
        discount_amount: 0,
        created_at: new Date(),
        voucher: null,
        items: [],
      });

      await repository.updatePurchaseOrder(purchaseOrder);

      expect(prismaMock.purchaseOrder.update).toHaveBeenCalledWith({
        where: { id: purchaseOrder.id },
        data: {
          customerId: purchaseOrder.customer_id,
          code: purchaseOrder.code,
          status: purchaseOrder.status,
          voucherId: undefined,
          totalAmount: purchaseOrder.total_amount,
          discountAmount: purchaseOrder.discount_amount,
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
    });

    it('throws a RepositoryError if occur an unexpected error', () => {
      expect.assertions(2);

      prismaMock.purchaseOrder.update.mockRejectedValueOnce(new Error('test'));

      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        customer_id: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        status: PurchaseOrderStatus.DRAFT,
        voucher: null,
        created_at: new Date(),
        items: [],
      });

      return repository.updatePurchaseOrder(purchaseOrder).catch((e: any) => {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaPurchaseOrderRepository - test');
      });
    });
  });

  describe('PrismaPurchaseOrderRepository.getPurchaseOrderItemById()', () => {
    it('returns a purchase order item by id', async () => {
      expect.assertions(6);

      const fakePurchaseOrderItem = {
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number().toString(), 10),
        purchaseOrderId: faker.datatype.uuid(),
        product: {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          amount: faker.datatype.float(),
        },
      };

      prismaMock.purchaseOrderItem.findUnique.mockResolvedValueOnce(fakePurchaseOrderItem as any);

      const purchaseOrderItem = await repository.getPurchaseOrderItemById(fakePurchaseOrderItem.id);

      expect(purchaseOrderItem!.id).toEqual(fakePurchaseOrderItem.id);
      expect(purchaseOrderItem!.quantity).toEqual(fakePurchaseOrderItem.quantity);
      expect(purchaseOrderItem!.purchase_order_id).toEqual(fakePurchaseOrderItem.purchaseOrderId);
      expect(purchaseOrderItem!.product).toEqual(new Product({
        id: fakePurchaseOrderItem.product.id,
        name: fakePurchaseOrderItem.product.name,
        amount: fakePurchaseOrderItem.product.amount,
      }));

      expect(prismaMock.purchaseOrderItem.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.purchaseOrderItem.findUnique).toHaveBeenCalledWith({
        where: { id: fakePurchaseOrderItem.id },
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
    });

    it("returns null if purchase order item doesn't exist", async () => {
      expect.assertions(3);

      const fakePurchaseOrderItemId = faker.datatype.uuid();

      prismaMock.purchaseOrderItem.findUnique.mockResolvedValueOnce(null);

      const purchaseOrderItem = await repository.getPurchaseOrderItemById(fakePurchaseOrderItemId);

      expect(purchaseOrderItem).toBeNull();

      expect(prismaMock.purchaseOrderItem.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.purchaseOrderItem.findUnique).toHaveBeenCalledWith({
        where: { id: fakePurchaseOrderItemId },
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
    });

    it('throws a RepositoryError if occur an unexpected error', () => {
      expect.assertions(2);

      const fakePurchaseOrderItemId = faker.datatype.uuid();

      prismaMock.purchaseOrderItem.findUnique.mockRejectedValueOnce(new Error('test'));

      return repository.getPurchaseOrderItemById(fakePurchaseOrderItemId).catch((e: any) => {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaPurchaseOrderRepository - test');
      });
    });
  });

  describe('PrismaPurchaseOrderRepository.getPurchaseOrderItem()', () => {
    it('gets a purchase order item by purchase order id', async () => {
      expect.assertions(6);

      const fakePurchaseOrderId = faker.datatype.uuid();

      const fakePurchaseOrderItem = {
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number().toString(), 10),
        purchaseOrderId: fakePurchaseOrderId,
        product: {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          amount: faker.datatype.float(),
        },
      };

      prismaMock.purchaseOrderItem.findFirst.mockResolvedValueOnce(fakePurchaseOrderItem as any);

      const purchaseOrderItem = await repository.getPurchaseOrderItem({
        purchase_order_id: fakePurchaseOrderId,
        product_id: fakePurchaseOrderItem.product.id,
      });

      expect(purchaseOrderItem!.id).toEqual(fakePurchaseOrderItem.id);
      expect(purchaseOrderItem!.quantity).toEqual(fakePurchaseOrderItem.quantity);
      expect(purchaseOrderItem!.purchase_order_id).toEqual(fakePurchaseOrderItem.purchaseOrderId);
      expect(purchaseOrderItem!.product).toEqual(new Product({
        id: fakePurchaseOrderItem.product.id,
        name: fakePurchaseOrderItem.product.name,
        amount: fakePurchaseOrderItem.product.amount,
      }));

      expect(prismaMock.purchaseOrderItem.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.purchaseOrderItem.findFirst).toHaveBeenCalledWith({
        where: {
          purchaseOrderId: fakePurchaseOrderId,
          productId: fakePurchaseOrderItem.product.id,
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
    });

    it('throws a RepositoryError if occur an unexpected error', () => {
      expect.assertions(2);

      prismaMock.purchaseOrderItem.findFirst.mockRejectedValueOnce(new Error('test'));

      return repository.getPurchaseOrderItem({
        purchase_order_id: faker.datatype.uuid(),
        product_id: faker.datatype.uuid(),
      }).catch((e: any) => {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaPurchaseOrderRepository - test');
      });
    });
  });

  describe('PrismaPurchaseOrderRepository.addPurchaseOrderItem()', () => {
    it('calls prisma.purchaseOrderItem.create method with correct params', async () => {
      expect.assertions(1);

      const purchaseOrderItem = new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number().toString(), 10),
        purchase_order_id: faker.datatype.uuid(),
        product: {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          amount: faker.datatype.float(),
        },
      });

      await repository.addPurchaseOrderItem(purchaseOrderItem);

      expect(prismaMock.purchaseOrderItem.create).toHaveBeenCalledWith({
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
    });

    it('throws a RepositoryError if occur an unexpected error', async () => {
      expect.assertions(2);

      prismaMock.purchaseOrderItem.create.mockRejectedValueOnce(new Error('test'));

      return repository.addPurchaseOrderItem(
        new PurchaseOrderItem({
          id: faker.datatype.uuid(),
          quantity: parseInt(faker.datatype.number().toString(), 10),
          purchase_order_id: faker.datatype.uuid(),
          product: {
            id: faker.datatype.uuid(),
            name: faker.commerce.product(),
            amount: faker.datatype.float(),
          },
        }),
      ).catch((e: any) => {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaPurchaseOrderRepository - test');
      });
    });
  });

  describe('PrismaPurchaseOrderRepository.updatePurchaseOrderItem()', () => {
    it('calls prisma.purchaseOrderItem.update method with correct params', async () => {
      expect.assertions(1);

      const purchaseOrderItem = new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number().toString(), 10),
        purchase_order_id: faker.datatype.uuid(),
        product: {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          amount: faker.datatype.float(),
        },
      });

      await repository.updatePurchaseOrderItem(purchaseOrderItem);

      expect(prismaMock.purchaseOrderItem.update).toHaveBeenCalledWith({
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
    });

    it('throws a RepositoryError if occur an unexpected error', () => {
      expect.assertions(2);

      prismaMock.purchaseOrderItem.update.mockRejectedValueOnce(new Error('test'));

      return repository.updatePurchaseOrderItem(
        new PurchaseOrderItem({
          id: faker.datatype.uuid(),
          quantity: parseInt(faker.datatype.number().toString(), 10),
          purchase_order_id: faker.datatype.uuid(),
          product: {
            id: faker.datatype.uuid(),
            name: faker.commerce.product(),
            amount: faker.datatype.float(),
          },
        }),
      ).catch((e: any) => {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaPurchaseOrderRepository - test');
      });
    });
  });

  describe('PrismaPurchaseOrderRepository.deletePurchaseOrderItem()', () => {
    it('calls prisma.purchaseOrderItem.delete with correct params', async () => {
      expect.assertions(1);

      const fakePurchaseOrderItem = {
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number().toString(), 10),
        purchase_order_id: faker.datatype.uuid(),
        product: {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          amount: faker.datatype.float(),
        },
      };

      prismaMock.purchaseOrderItem.delete.mockResolvedValueOnce(fakePurchaseOrderItem as any);

      await repository.deletePurchaseOrderItem(fakePurchaseOrderItem.id);

      expect(prismaMock.purchaseOrderItem.delete).toHaveBeenCalledWith({
        where: { id: fakePurchaseOrderItem.id },
      });
    });

    it('throws a RepositoryError if occur an unexpected error', () => {
      expect.assertions(2);

      const fakePurchaseOrderItemId = faker.datatype.uuid();

      prismaMock.purchaseOrderItem.delete.mockRejectedValueOnce(new Error('test'));

      return repository.deletePurchaseOrderItem(fakePurchaseOrderItemId).catch((e: any) => {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaPurchaseOrderRepository - test');
      });
    });
  });

  describe('PrismaPurchaseOrderRepository.getVoucherByCode()', () => {
    it('gets a voucher by code', async () => {
      expect.assertions(11);

      const fakeVoucher = {
        id: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        percentageAmount: faker.datatype.float(),
        rawDiscountAmount: faker.datatype.float(),
        quantity: parseInt(faker.datatype.number().toString(), 10),
        type: VoucherDiscountTypes.ABSOLUTE,
        createdAt: new Date(),
        expiresAt: new Date(),
        active: faker.datatype.boolean(),
        usedAt: null,
      };

      prismaMock.voucher.findFirst.mockResolvedValueOnce(fakeVoucher as any);

      const voucher = await repository.getVoucherByCode(fakeVoucher.code);

      expect(voucher!.id).toEqual(fakeVoucher.id);
      expect(voucher!.code).toEqual(fakeVoucher.code);
      expect(voucher!.percentage_amount).toEqual(fakeVoucher.percentageAmount);
      expect(voucher!.raw_discount_amount).toEqual(fakeVoucher.rawDiscountAmount);
      expect(voucher!.quantity).toEqual(fakeVoucher.quantity);
      expect(voucher!.type).toEqual(fakeVoucher.type);
      expect(voucher!.created_at).toEqual(fakeVoucher.createdAt);
      expect(voucher!.expires_at).toEqual(fakeVoucher.expiresAt);
      expect(voucher!.usedAt).toBeNull();

      expect(prismaMock.voucher.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.voucher.findFirst).toHaveBeenCalledWith({
        where: { code: fakeVoucher.code },
      });
    });

    it("returns null if voucher doesn't exist", async () => {
      expect.assertions(3);

      const fakeVoucherCode = parseInt(faker.datatype.number().toString(), 10);

      prismaMock.voucher.findFirst.mockResolvedValueOnce(null);

      const voucher = await repository.getVoucherByCode(fakeVoucherCode);

      expect(voucher).toBeNull();
      expect(prismaMock.voucher.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.voucher.findFirst).toHaveBeenCalledWith({
        where: { code: fakeVoucherCode },
      });
    });

    it('throws a RepositoryError if occur an unexpected error', () => {
      expect.assertions(2);

      const fakeVoucherCode = parseInt(faker.datatype.number().toString(), 10);

      prismaMock.voucher.findFirst.mockRejectedValueOnce(new Error('test'));

      return repository.getVoucherByCode(fakeVoucherCode).catch((e: any) => {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaPurchaseOrderRepository - test');
      });
    });
  });

  describe('PrismaPurchaseOrderRepository.countPurchaseOrders()', () => {
    it('counts all the purchase orders', async () => {
      expect.assertions(2);

      const fakeQuantityOfPuchaseOrders = parseInt(faker.datatype.number().toString(), 10);

      prismaMock.purchaseOrder.count.mockResolvedValueOnce(fakeQuantityOfPuchaseOrders);

      const result = await repository.countPurchaseOrders();

      expect(prismaMock.purchaseOrder.count).toHaveBeenCalledTimes(1);
      expect(result).toEqual(fakeQuantityOfPuchaseOrders);
    });

    it('throws a RepositoryError if occur an unexpected error', () => {
      expect.assertions(2);

      prismaMock.purchaseOrder.count.mockImplementationOnce(() => {
        throw new Error('test');
      });

      return repository.countPurchaseOrders().catch((e: any) => {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaPurchaseOrderRepository - test');
      });
    });
  });

  describe('PrismaPurchaseOrderRepository.countPurchaseOrderItems()', () => {
    it('counts all the purchase order items', async () => {
      expect.assertions(2);

      const fakeQuantityOfPuchaseOrderItems = parseInt(faker.datatype.number().toString(), 10);

      prismaMock.purchaseOrderItem.count.mockResolvedValueOnce(fakeQuantityOfPuchaseOrderItems);

      const result = await repository.countPurchaseOrderItems();

      expect(prismaMock.purchaseOrderItem.count).toHaveBeenCalledTimes(1);
      expect(result).toEqual(fakeQuantityOfPuchaseOrderItems);
    });

    it('throws a RepositoryError if occur an unexpected error', () => {
      expect.assertions(2);

      prismaMock.purchaseOrderItem.count.mockImplementationOnce(() => {
        throw new Error('test');
      });

      return repository.countPurchaseOrderItems().catch((e: any) => {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaPurchaseOrderRepository - test');
      });
    });
  });

  describe('PrismaPurchaseOrderRepository.countVouchers()', () => {
    it('counts all the vouchers', async () => {
      expect.assertions(2);

      const fakeQuantityOfVouchers = parseInt(faker.datatype.number().toString(), 10);

      prismaMock.voucher.count.mockResolvedValueOnce(fakeQuantityOfVouchers);

      const result = await repository.countVouchers();

      expect(prismaMock.voucher.count).toHaveBeenCalledTimes(1);
      expect(result).toEqual(fakeQuantityOfVouchers);
    });

    it('throws a RepositoryError if occur an unexpected error', () => {
      expect.assertions(2);

      prismaMock.voucher.count.mockImplementationOnce(() => {
        throw new Error('test');
      });

      return repository.countVouchers().catch((e: any) => {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaPurchaseOrderRepository - test');
      });
    });
  });
});
