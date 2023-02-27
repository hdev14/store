import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import Product from '@sales/domain/Product';
import PurchaseOrder, { PurchaseOrderStatus } from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import Voucher, { VoucherDiscountTypes } from '@sales/domain/Voucher';
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

      const repository = new PrismaPurchaseOrderRepository();

      const purchaseOrder = await repository.getPurchaseOrderById(purchaseOrderId);

      expect(purchaseOrder!.id).toEqual(fakePurchaseOrder.id);
      expect(purchaseOrder!.customerId).toEqual(fakePurchaseOrder.customerId);
      expect(purchaseOrder!.code).toEqual(fakePurchaseOrder.code);
      expect(purchaseOrder!.createdAt).toEqual(fakePurchaseOrder.createdAt);
      expect(purchaseOrder!.discountAmount).toEqual(fakePurchaseOrder.discountAmount);
      expect(purchaseOrder!.voucher!.id).toEqual(fakePurchaseOrder.voucher.id);
      expect(purchaseOrder!.voucher!.active).toEqual(fakePurchaseOrder.voucher.active);
      expect(purchaseOrder!.voucher!.code).toEqual(fakePurchaseOrder.voucher.code);
      expect(purchaseOrder!.voucher!.type).toEqual(fakePurchaseOrder.voucher.type);
      expect(purchaseOrder!.voucher!.percentageAmount)
        .toEqual(fakePurchaseOrder.voucher.percentageAmount);
      expect(purchaseOrder!.voucher!.rawDiscountAmount)
        .toEqual(fakePurchaseOrder.voucher.rawDiscountAmount);
      expect(purchaseOrder!.voucher!.createdAt).toEqual(fakePurchaseOrder.voucher.createdAt);
      expect(purchaseOrder!.voucher!.expiresAt).toEqual(fakePurchaseOrder.voucher.expiresAt);
      expect(purchaseOrder!.voucher!.usedAt).toEqual(null);

      purchaseOrder!.items.forEach((item, index) => {
        expect(item.id).toEqual(fakePurchaseOrder.items[index].id);
        expect(item.product.id).toEqual(fakePurchaseOrder.items[index].product.id);
        expect(item.product.name).toEqual(fakePurchaseOrder.items[index].product.name);
        expect(item.product.amount).toEqual(fakePurchaseOrder.items[index].product.amount);
        expect(item.quantity).toEqual(fakePurchaseOrder.items[index].quantity);
        expect(item.purchaseOrderId).toEqual(fakePurchaseOrder.items[index].purchaseOrderId);
      });

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

    it('throws a RepositoryError if occur an unexpected error', async () => {
      expect.assertions(2);

      const purchaseOrderId = faker.datatype.uuid();

      prismaMock.purchaseOrder.findUnique.mockRejectedValueOnce(new Error('test'));

      const repository = new PrismaPurchaseOrderRepository();

      try {
        await repository.getPurchaseOrderById(purchaseOrderId);
      } catch (e: any) {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaPurchaseOrderRepository - test');
      }
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

      const repository = new PrismaPurchaseOrderRepository();

      const purchaseOrders = await repository.getPurchaseOrdersByCustomerId(customerId);

      purchaseOrders.forEach((purchaseOrder, index) => {
        expect(purchaseOrder!.id).toEqual(fakePurchaseOrders[index].id);
        expect(purchaseOrder!.customerId).toEqual(fakePurchaseOrders[index].customerId);
        expect(purchaseOrder!.code).toEqual(fakePurchaseOrders[index].code);
        expect(purchaseOrder!.createdAt).toEqual(fakePurchaseOrders[index].createdAt);
        expect(purchaseOrder!.discountAmount).toEqual(fakePurchaseOrders[index].discountAmount);
        expect(purchaseOrder!.voucher!.id).toEqual(fakePurchaseOrders[index].voucher.id);
        expect(purchaseOrder!.voucher!.active).toEqual(fakePurchaseOrders[index].voucher.active);
        expect(purchaseOrder!.voucher!.code).toEqual(fakePurchaseOrders[index].voucher.code);
        expect(purchaseOrder!.voucher!.type).toEqual(fakePurchaseOrders[index].voucher.type);
        expect(purchaseOrder!.voucher!.percentageAmount)
          .toEqual(fakePurchaseOrders[index].voucher.percentageAmount);
        expect(purchaseOrder!.voucher!.rawDiscountAmount)
          .toEqual(fakePurchaseOrders[index].voucher.rawDiscountAmount);
        expect(purchaseOrder!.voucher!.createdAt)
          .toEqual(fakePurchaseOrders[index].voucher.createdAt);
        expect(purchaseOrder!.voucher!.expiresAt)
          .toEqual(fakePurchaseOrders[index].voucher.expiresAt);
        expect(purchaseOrder!.voucher!.usedAt).toEqual(null);

        purchaseOrder!.items.forEach((item, idx) => {
          expect(item.id).toEqual(fakePurchaseOrders[index].items[idx].id);
          expect(item.product.id).toEqual(fakePurchaseOrders[index].items[idx].product.id);
          expect(item.product.name).toEqual(fakePurchaseOrders[index].items[idx].product.name);
          expect(item.product.amount).toEqual(fakePurchaseOrders[index].items[idx].product.amount);
          expect(item.quantity).toEqual(fakePurchaseOrders[index].items[idx].quantity);
          expect(item.purchaseOrderId)
            .toEqual(fakePurchaseOrders[index].items[idx].purchaseOrderId);
        });
      });

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

    it('throws a RepositoryError if occur an unexpected error', async () => {
      expect.assertions(2);

      const customerId = faker.datatype.uuid();

      prismaMock.purchaseOrder.findMany.mockRejectedValueOnce(new Error('test'));

      const repository = new PrismaPurchaseOrderRepository();

      try {
        await repository.getPurchaseOrdersByCustomerId(customerId);
      } catch (e: any) {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaPurchaseOrderRepository - test');
      }
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

      const repository = new PrismaPurchaseOrderRepository();

      const purchaseOrder = await repository.getDraftPurchaseOrderByCustomerId(customerId);

      expect(purchaseOrder!.id).toEqual(fakeDraftPurchaseOrder.id);
      expect(purchaseOrder!.customerId).toEqual(fakeDraftPurchaseOrder.customerId);
      expect(purchaseOrder!.code).toEqual(fakeDraftPurchaseOrder.code);
      expect(purchaseOrder!.createdAt).toEqual(fakeDraftPurchaseOrder.createdAt);
      expect(purchaseOrder!.discountAmount).toEqual(fakeDraftPurchaseOrder.discountAmount);

      purchaseOrder!.items.forEach((item, idx) => {
        expect(item.id).toEqual(fakeDraftPurchaseOrder.items[idx].id);
        expect(item.product.id).toEqual(fakeDraftPurchaseOrder.items[idx].product.id);
        expect(item.product.name).toEqual(fakeDraftPurchaseOrder.items[idx].product.name);
        expect(item.product.amount).toEqual(fakeDraftPurchaseOrder.items[idx].product.amount);
        expect(item.quantity).toEqual(fakeDraftPurchaseOrder.items[idx].quantity);
        expect(item.purchaseOrderId)
          .toEqual(fakeDraftPurchaseOrder.items[idx].purchaseOrderId);
      });

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

      const repository = new PrismaPurchaseOrderRepository();

      try {
        await repository.getDraftPurchaseOrderByCustomerId(customerId);
      } catch (e: any) {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaPurchaseOrderRepository - test');
      }
    });
  });

  describe('PrismaPurchaseOrderRepository.addPurchaseOrder()', () => {
    it('calls prisma.purchaseOrder.create with correct params', async () => {
      expect.assertions(1);

      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        customerId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        status: PurchaseOrderStatus.DRAFT,
        voucher: new Voucher({
          id: faker.datatype.uuid(),
          percentageAmount: 0,
          rawDiscountAmount: 0,
          quantity: parseInt(faker.datatype.number().toString(), 10),
          type: VoucherDiscountTypes.ABSOLUTE,
          active: faker.datatype.boolean(),
          code: parseInt(faker.datatype.number().toString(), 10),
          expiresAt: new Date(),
          createdAt: new Date(),
          usedAt: null,
        }),
        createdAt: new Date(),
      });

      const repository = new PrismaPurchaseOrderRepository();

      await repository.addPurchaseOrder(purchaseOrder);

      expect(prismaMock.purchaseOrder.create).toHaveBeenCalledWith({
        data: {
          id: purchaseOrder.id,
          customerId: purchaseOrder.customerId,
          code: purchaseOrder.code,
          status: purchaseOrder.status,
          voucherId: purchaseOrder.voucher!.id,
          createdAt: purchaseOrder.createdAt,
          totalAmount: purchaseOrder.totalAmount,
          discountAmount: purchaseOrder.discountAmount,
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
        customerId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        status: PurchaseOrderStatus.DRAFT,
        totalAmount: 0,
        discountAmount: 0,
        createdAt: new Date(),
        voucher: null,
      });

      const repository = new PrismaPurchaseOrderRepository();

      await repository.addPurchaseOrder(purchaseOrder);

      expect(prismaMock.purchaseOrder.create).toHaveBeenCalledWith({
        data: {
          id: purchaseOrder.id,
          customerId: purchaseOrder.customerId,
          code: purchaseOrder.code,
          status: purchaseOrder.status,
          voucherId: undefined,
          createdAt: purchaseOrder.createdAt,
          totalAmount: purchaseOrder.totalAmount,
          discountAmount: purchaseOrder.discountAmount,
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
        customerId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        status: PurchaseOrderStatus.DRAFT,
        voucher: null,
        createdAt: new Date(),
      });

      const repository = new PrismaPurchaseOrderRepository();

      try {
        await repository.addPurchaseOrder(purchaseOrder);
      } catch (e: any) {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaPurchaseOrderRepository - test');
      }
    });
  });

  describe('PrismaPurchaseOrderRepository.updatePurchaseOrder()', () => {
    it('calls prisma.purchaseOrder.update method with correct params', async () => {
      expect.assertions(1);

      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        customerId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        status: PurchaseOrderStatus.DRAFT,
        totalAmount: 0,
        discountAmount: 0,
        createdAt: new Date(),
        voucher: null,
      });

      const repository = new PrismaPurchaseOrderRepository();

      await repository.updatePurchaseOrder(purchaseOrder);

      expect(prismaMock.purchaseOrder.update).toHaveBeenCalledWith({
        where: { id: purchaseOrder.id },
        data: {
          customerId: purchaseOrder.customerId,
          code: purchaseOrder.code,
          status: purchaseOrder.status,
          voucherId: undefined,
          totalAmount: purchaseOrder.totalAmount,
          discountAmount: purchaseOrder.discountAmount,
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

    it('throws a RepositoryError if occur an unexpected error', async () => {
      expect.assertions(2);

      prismaMock.purchaseOrder.update.mockRejectedValueOnce(new Error('test'));

      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        customerId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        status: PurchaseOrderStatus.DRAFT,
        voucher: null,
        createdAt: new Date(),
      });

      const repository = new PrismaPurchaseOrderRepository();

      try {
        await repository.updatePurchaseOrder(purchaseOrder);
      } catch (e: any) {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaPurchaseOrderRepository - test');
      }
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

      const repository = new PrismaPurchaseOrderRepository();

      const purchaseOrderItem = await repository.getPurchaseOrderItemById(fakePurchaseOrderItem.id);

      expect(purchaseOrderItem!.id).toEqual(fakePurchaseOrderItem.id);
      expect(purchaseOrderItem!.quantity).toEqual(fakePurchaseOrderItem.quantity);
      expect(purchaseOrderItem!.purchaseOrderId).toEqual(fakePurchaseOrderItem.purchaseOrderId);
      expect(purchaseOrderItem!.product).toEqual(new Product(
        fakePurchaseOrderItem.product.id,
        fakePurchaseOrderItem.product.name,
        fakePurchaseOrderItem.product.amount,
      ));

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

      const repository = new PrismaPurchaseOrderRepository();

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

    it('throws a RepositoryError if occur an unexpected error', async () => {
      expect.assertions(2);

      const fakePurchaseOrderItemId = faker.datatype.uuid();

      prismaMock.purchaseOrderItem.findUnique.mockRejectedValueOnce(new Error('test'));

      const repository = new PrismaPurchaseOrderRepository();

      try {
        await repository.getPurchaseOrderItemById(fakePurchaseOrderItemId);
      } catch (e: any) {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaPurchaseOrderRepository - test');
      }
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

      const repository = new PrismaPurchaseOrderRepository();

      const purchaseOrderItem = await repository.getPurchaseOrderItem({
        purchaseOrderId: fakePurchaseOrderId,
        productId: fakePurchaseOrderItem.product.id,
      });

      expect(purchaseOrderItem!.id).toEqual(fakePurchaseOrderItem.id);
      expect(purchaseOrderItem!.quantity).toEqual(fakePurchaseOrderItem.quantity);
      expect(purchaseOrderItem!.purchaseOrderId).toEqual(fakePurchaseOrderItem.purchaseOrderId);
      expect(purchaseOrderItem!.product).toEqual(new Product(
        fakePurchaseOrderItem.product.id,
        fakePurchaseOrderItem.product.name,
        fakePurchaseOrderItem.product.amount,
      ));

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

    it('throws a RepositoryError if occur an unexpected error', async () => {
      expect.assertions(2);

      prismaMock.purchaseOrderItem.findFirst.mockRejectedValueOnce(new Error('test'));

      const repository = new PrismaPurchaseOrderRepository();

      try {
        await repository.getPurchaseOrderItem({
          purchaseOrderId: faker.datatype.uuid(),
          productId: faker.datatype.uuid(),
        });
      } catch (e: any) {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaPurchaseOrderRepository - test');
      }
    });
  });

  describe('PrismaPurchaseOrderRepository.addPurchaseOrderItem()', () => {
    it('calls prisma.purchaseOrderItem.create method with correct params', async () => {
      expect.assertions(1);

      const repository = new PrismaPurchaseOrderRepository();

      const purchaseOrderItem = new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number().toString(), 10),
        purchaseOrderId: faker.datatype.uuid(),
        product: new Product(
          faker.datatype.uuid(),
          faker.commerce.product(),
          faker.datatype.float(),
        ),
      });

      await repository.addPurchaseOrderItem(purchaseOrderItem);

      expect(prismaMock.purchaseOrderItem.create).toHaveBeenCalledWith({
        data: {
          id: purchaseOrderItem.id,
          purchaseOrderId: purchaseOrderItem.purchaseOrderId,
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

      const repository = new PrismaPurchaseOrderRepository();

      try {
        await repository.addPurchaseOrderItem(
          new PurchaseOrderItem({
            id: faker.datatype.uuid(),
            quantity: parseInt(faker.datatype.number().toString(), 10),
            purchaseOrderId: faker.datatype.uuid(),
            product: new Product(
              faker.datatype.uuid(),
              faker.commerce.product(),
              faker.datatype.float(),
            ),
          }),
        );
      } catch (e: any) {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaPurchaseOrderRepository - test');
      }
    });
  });

  describe('PrismaPurchaseOrderRepository.updatePurchaseOrderItem()', () => {
    it('calls prisma.purchaseOrderItem.update method with correct params', async () => {
      expect.assertions(1);

      const repository = new PrismaPurchaseOrderRepository();

      const purchaseOrderItem = new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number().toString(), 10),
        purchaseOrderId: faker.datatype.uuid(),
        product: new Product(
          faker.datatype.uuid(),
          faker.commerce.product(),
          faker.datatype.float(),
        ),
      });

      await repository.updatePurchaseOrderItem(purchaseOrderItem);

      expect(prismaMock.purchaseOrderItem.update).toHaveBeenCalledWith({
        where: { id: purchaseOrderItem.id },
        data: {
          purchaseOrderId: purchaseOrderItem.purchaseOrderId,
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

      prismaMock.purchaseOrderItem.update.mockRejectedValueOnce(new Error('test'));

      const repository = new PrismaPurchaseOrderRepository();

      try {
        await repository.updatePurchaseOrderItem(
          new PurchaseOrderItem({
            id: faker.datatype.uuid(),
            quantity: parseInt(faker.datatype.number().toString(), 10),
            purchaseOrderId: faker.datatype.uuid(),
            product: new Product(
              faker.datatype.uuid(),
              faker.commerce.product(),
              faker.datatype.float(),
            ),
          }),
        );
      } catch (e: any) {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaPurchaseOrderRepository - test');
      }
    });
  });

  describe('PrismaPurchaseOrderRepository.deletePurchaseOrderItem()', () => {
    it('calls prisma.purchaseOrderItem.delete with correct params', async () => {
      expect.assertions(1);

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

      prismaMock.purchaseOrderItem.delete.mockResolvedValueOnce(fakePurchaseOrderItem as any);

      const repository = new PrismaPurchaseOrderRepository();

      await repository.deletePurchaseOrderItem(fakePurchaseOrderItem.id);

      expect(prismaMock.purchaseOrderItem.delete).toHaveBeenCalledWith({
        where: { id: fakePurchaseOrderItem.id },
      });
    });

    it('throws a RepositoryError if occur an unexpected error', async () => {
      expect.assertions(2);

      const fakePurchaseOrderItemId = faker.datatype.uuid();

      prismaMock.purchaseOrderItem.delete.mockRejectedValueOnce(new Error('test'));

      const repository = new PrismaPurchaseOrderRepository();

      try {
        await repository.deletePurchaseOrderItem(fakePurchaseOrderItemId);
      } catch (e: any) {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaPurchaseOrderRepository - test');
      }
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

      const repository = new PrismaPurchaseOrderRepository();

      const voucher = await repository.getVoucherByCode(fakeVoucher.code);

      expect(voucher!.id).toEqual(fakeVoucher.id);
      expect(voucher!.code).toEqual(fakeVoucher.code);
      expect(voucher!.percentageAmount).toEqual(fakeVoucher.percentageAmount);
      expect(voucher!.rawDiscountAmount).toEqual(fakeVoucher.rawDiscountAmount);
      expect(voucher!.quantity).toEqual(fakeVoucher.quantity);
      expect(voucher!.type).toEqual(fakeVoucher.type);
      expect(voucher!.createdAt).toEqual(fakeVoucher.createdAt);
      expect(voucher!.expiresAt).toEqual(fakeVoucher.expiresAt);
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

      const repository = new PrismaPurchaseOrderRepository();

      const voucher = await repository.getVoucherByCode(fakeVoucherCode);

      expect(voucher).toBeNull();
      expect(prismaMock.voucher.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.voucher.findFirst).toHaveBeenCalledWith({
        where: { code: fakeVoucherCode },
      });
    });

    it('throws a RepositoryError if occur an unexpected error', async () => {
      expect.assertions(2);

      const fakeVoucherCode = parseInt(faker.datatype.number().toString(), 10);

      prismaMock.voucher.findFirst.mockRejectedValueOnce(new Error('test'));

      const repository = new PrismaPurchaseOrderRepository();

      try {
        await repository.getVoucherByCode(fakeVoucherCode);
      } catch (e: any) {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaPurchaseOrderRepository - test');
      }
    });
  });

  describe('PrismaPurchaseOrderRepository.countPurchaseOrders()', () => {
    it('counts all the purchase orders', async () => {
      expect.assertions(2);

      const fakeQuantityOfPuchaseOrders = parseInt(faker.datatype.number().toString(), 10);

      prismaMock.purchaseOrder.count.mockResolvedValueOnce(fakeQuantityOfPuchaseOrders);

      const repository = new PrismaPurchaseOrderRepository();

      const result = await repository.countPurchaseOrders();

      expect(prismaMock.purchaseOrder.count).toHaveBeenCalledTimes(1);
      expect(result).toEqual(fakeQuantityOfPuchaseOrders);
    });

    it('throws a RepositoryError if occur an unexpected error', async () => {
      expect.assertions(2);

      prismaMock.purchaseOrder.count.mockImplementationOnce(() => {
        throw new Error('test');
      });

      const repository = new PrismaPurchaseOrderRepository();

      try {
        await repository.countPurchaseOrders();
      } catch (e: any) {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaPurchaseOrderRepository - test');
      }
    });
  });

  describe('PrismaPurchaseOrderRepository.countPurchaseOrderItems()', () => {
    it('counts all the purchase order items', async () => {
      expect.assertions(2);

      const fakeQuantityOfPuchaseOrderItems = parseInt(faker.datatype.number().toString(), 10);

      prismaMock.purchaseOrderItem.count.mockResolvedValueOnce(fakeQuantityOfPuchaseOrderItems);

      const repository = new PrismaPurchaseOrderRepository();

      const result = await repository.countPurchaseOrderItems();

      expect(prismaMock.purchaseOrderItem.count).toHaveBeenCalledTimes(1);
      expect(result).toEqual(fakeQuantityOfPuchaseOrderItems);
    });

    it('throws a RepositoryError if occur an unexpected error', async () => {
      expect.assertions(2);

      prismaMock.purchaseOrderItem.count.mockImplementationOnce(() => {
        throw new Error('test');
      });

      const repository = new PrismaPurchaseOrderRepository();

      try {
        await repository.countPurchaseOrderItems();
      } catch (e: any) {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaPurchaseOrderRepository - test');
      }
    });
  });

  describe('PrismaPurchaseOrderRepository.countVouchers()', () => {
    it('counts all the vouchers', async () => {
      expect.assertions(2);

      const fakeQuantityOfVouchers = parseInt(faker.datatype.number().toString(), 10);

      prismaMock.voucher.count.mockResolvedValueOnce(fakeQuantityOfVouchers);

      const repository = new PrismaPurchaseOrderRepository();

      const result = await repository.countVouchers();

      expect(prismaMock.voucher.count).toHaveBeenCalledTimes(1);
      expect(result).toEqual(fakeQuantityOfVouchers);
    });

    it('throws a RepositoryError if occur an unexpected error', async () => {
      expect.assertions(2);

      prismaMock.voucher.count.mockImplementationOnce(() => {
        throw new Error('test');
      });

      const repository = new PrismaPurchaseOrderRepository();

      try {
        await repository.countVouchers();
      } catch (e: any) {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('PrismaPurchaseOrderRepository - test');
      }
    });
  });
});
