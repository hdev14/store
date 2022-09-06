import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import Product from '@sales/domain/Product';
import PurchaseOrder, { PurchaseOrderStatus } from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import Voucher, { VoucherDiscountTypes } from '@sales/domain/Voucher';
import PrismaPurchaseOrderRepository from '@sales/infra/persistence/PrismaPurchaseOrderRepository';
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
        clientId: faker.datatype.uuid(),
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
      expect(purchaseOrder!.clientId).toEqual(fakePurchaseOrder.clientId);
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
  });

  describe('PrismaPurchaseOrderRepository.getPurchaseOrdersByClientId()', () => {
    it('returns purchase orders by client id', async () => {
      expect.assertions(28);

      const clientId = faker.datatype.uuid();
      const purchaseOrderId = faker.datatype.uuid();

      const fakePurchaseOrders = [{
        id: purchaseOrderId,
        clientId,
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

      const purchaseOrders = await repository.getPurchaseOrdersByClientId(clientId);

      purchaseOrders.forEach((purchaseOrder, index) => {
        expect(purchaseOrder!.id).toEqual(fakePurchaseOrders[index].id);
        expect(purchaseOrder!.clientId).toEqual(fakePurchaseOrders[index].clientId);
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
        where: { clientId },
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
  });

  describe('PrismaPurchaseOrderRepository.getDraftPurchaseOrderByClientId()', () => {
    it('returns a draft purchase order by client id', async () => {
      expect.assertions(13);

      const clientId = faker.datatype.uuid();
      const purchaseOrderId = faker.datatype.uuid();

      const fakeDraftPurchaseOrder = {
        id: purchaseOrderId,
        clientId,
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

      const purchaseOrder = await repository.getDraftPurchaseOrderByClientId(clientId);

      expect(purchaseOrder!.id).toEqual(fakeDraftPurchaseOrder.id);
      expect(purchaseOrder!.clientId).toEqual(fakeDraftPurchaseOrder.clientId);
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
        where: { clientId, status: PurchaseOrderStatus.DRAFT },
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
  });

  describe('PrismaPurchaseOrderRepository.addPurchaseOrder()', () => {
    it('creates a new purchase order', async () => {
      expect.assertions(17);

      const clientId = faker.datatype.uuid();
      const purchaseOrderId = faker.datatype.uuid();

      const fakePurchaseOrder = {
        id: purchaseOrderId,
        clientId,
        code: parseInt(faker.datatype.number().toString(), 10),
        status: PurchaseOrderStatus.DRAFT,
        totalAmount: 0,
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
        items: [],
      };

      prismaMock.purchaseOrder.create.mockResolvedValueOnce(fakePurchaseOrder as any);

      const purchaseOrder = new PurchaseOrder({
        id: fakePurchaseOrder.id,
        clientId: fakePurchaseOrder.clientId,
        code: fakePurchaseOrder.code,
        status: fakePurchaseOrder.status,
        voucher: new Voucher({
          id: fakePurchaseOrder.voucher.id,
          active: fakePurchaseOrder.voucher.active,
          code: fakePurchaseOrder.voucher.code,
          percentageAmount: fakePurchaseOrder.voucher.percentageAmount,
          rawDiscountAmount: fakePurchaseOrder.voucher.rawDiscountAmount,
          quantity: fakePurchaseOrder.voucher.quantity,
          type: fakePurchaseOrder.voucher.type,
          createdAt: fakePurchaseOrder.voucher.createdAt,
          expiresAt: fakePurchaseOrder.voucher.expiresAt,
          usedAt: null,
        }),
        createdAt: fakePurchaseOrder.createdAt,
      });

      const repository = new PrismaPurchaseOrderRepository();

      const result = await repository.addPurchaseOrder(purchaseOrder);

      expect(result.id).toEqual(purchaseOrder.id);
      expect(result.clientId).toEqual(purchaseOrder.clientId);
      expect(result.code).toEqual(purchaseOrder.code);
      expect(result.createdAt).toEqual(purchaseOrder.createdAt);
      expect(result.discountAmount).toEqual(purchaseOrder.discountAmount);
      expect(result.voucher!.id).toEqual(purchaseOrder.voucher!.id);
      expect(result.voucher!.active).toEqual(purchaseOrder.voucher!.active);
      expect(result.voucher!.code).toEqual(purchaseOrder.voucher!.code);
      expect(result.voucher!.percentageAmount).toEqual(purchaseOrder.voucher!.percentageAmount);
      expect(result.voucher!.rawDiscountAmount).toEqual(purchaseOrder.voucher!.rawDiscountAmount);
      expect(result.voucher!.quantity).toEqual(purchaseOrder.voucher!.quantity);
      expect(result.voucher!.type).toEqual(purchaseOrder.voucher!.type);
      expect(result.voucher!.createdAt).toEqual(purchaseOrder.voucher!.createdAt);
      expect(result.voucher!.expiresAt).toEqual(purchaseOrder.voucher!.expiresAt);
      expect(result.voucher!.usedAt).toEqual(null);

      expect(prismaMock.purchaseOrder.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.purchaseOrder.create).toHaveBeenCalledWith({
        data: {
          id: fakePurchaseOrder.id,
          clientId: fakePurchaseOrder.clientId,
          code: fakePurchaseOrder.code,
          status: fakePurchaseOrder.status,
          voucherId: fakePurchaseOrder.voucher.id,
          createdAt: fakePurchaseOrder.createdAt,
          totalAmount: fakePurchaseOrder.totalAmount,
          discountAmount: fakePurchaseOrder.discountAmount,
        },
        include: {
          voucher: true,
        },
      });
    });

    it('creates a new purchase order without voucher', async () => {
      expect.assertions(8);

      const clientId = faker.datatype.uuid();
      const purchaseOrderId = faker.datatype.uuid();

      const fakePurchaseOrder = {
        id: purchaseOrderId,
        clientId,
        code: parseInt(faker.datatype.number().toString(), 10),
        status: PurchaseOrderStatus.DRAFT,
        totalAmount: 0,
        discountAmount: 0,
        createdAt: new Date(),
        voucher: null,
        items: [],
      };

      prismaMock.purchaseOrder.create.mockResolvedValueOnce(fakePurchaseOrder as any);

      const purchaseOrder = new PurchaseOrder({
        id: fakePurchaseOrder.id,
        clientId: fakePurchaseOrder.clientId,
        code: fakePurchaseOrder.code,
        status: fakePurchaseOrder.status,
        voucher: null,
        createdAt: fakePurchaseOrder.createdAt,
      });

      const repository = new PrismaPurchaseOrderRepository();

      const result = await repository.addPurchaseOrder(purchaseOrder);

      expect(result.id).toEqual(purchaseOrder.id);
      expect(result.clientId).toEqual(purchaseOrder.clientId);
      expect(result.code).toEqual(purchaseOrder.code);
      expect(result.createdAt).toEqual(purchaseOrder.createdAt);
      expect(result.discountAmount).toEqual(purchaseOrder.discountAmount);
      expect(result.voucher).toBe(null);

      expect(prismaMock.purchaseOrder.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.purchaseOrder.create).toHaveBeenCalledWith({
        data: {
          id: fakePurchaseOrder.id,
          clientId: fakePurchaseOrder.clientId,
          code: fakePurchaseOrder.code,
          status: fakePurchaseOrder.status,
          voucherId: undefined,
          createdAt: fakePurchaseOrder.createdAt,
          totalAmount: fakePurchaseOrder.totalAmount,
          discountAmount: fakePurchaseOrder.discountAmount,
        },
        include: {
          voucher: true,
        },
      });
    });
  });

  describe('PrismaPurchaseOrderRepository.updatePurchaseOrder()', () => {
    it('updates a specific purchase order', async () => {
      expect.assertions(8);

      const clientId = faker.datatype.uuid();
      const purchaseOrderId = faker.datatype.uuid();

      const fakePurchaseOrder = {
        id: purchaseOrderId,
        clientId,
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

      prismaMock.purchaseOrder.update.mockResolvedValueOnce(fakePurchaseOrder as any);

      const purchaseOrder = new PurchaseOrder({
        id: fakePurchaseOrder.id,
        clientId: fakePurchaseOrder.clientId,
        code: fakePurchaseOrder.code,
        status: fakePurchaseOrder.status,
        voucher: null,
        createdAt: fakePurchaseOrder.createdAt,
      });

      const repository = new PrismaPurchaseOrderRepository();

      const result = await repository.updatePurchaseOrder(purchaseOrder);

      expect(result.id).toEqual(purchaseOrder.id);
      expect(result.clientId).toEqual(purchaseOrder.clientId);
      expect(result.code).toEqual(purchaseOrder.code);
      expect(result.createdAt).toEqual(purchaseOrder.createdAt);
      expect(result.discountAmount).toEqual(purchaseOrder.discountAmount);
      expect(result.voucher).toBe(null);

      expect(prismaMock.purchaseOrder.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.purchaseOrder.update).toHaveBeenCalledWith({
        where: { id: fakePurchaseOrder.id },
        data: {
          clientId: fakePurchaseOrder.clientId,
          code: fakePurchaseOrder.code,
          status: fakePurchaseOrder.status,
          voucherId: undefined,
          totalAmount: fakePurchaseOrder.totalAmount,
          discountAmount: fakePurchaseOrder.discountAmount,
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
  });

  describe('PrismaPurchaseOrderRepository.getPurchaseOrderItemById()', () => {
    it('returns a purchase order item by id', async () => {
      expect.assertions(7);

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
  });

  describe('PrismaPurchaseOrderRepository.getPurchaseOrderItem()', () => {
    it('gets a purchase order item by purchase order id', async () => {
      expect.assertions(7);

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
      });

      expect(purchaseOrderItem!.id).toEqual(fakePurchaseOrderItem.id);
      expect(purchaseOrderItem!.quantity).toEqual(fakePurchaseOrderItem.quantity);
      expect(purchaseOrderItem!.purchaseOrderId).toEqual(fakePurchaseOrderItem.purchaseOrderId);
      expect(purchaseOrderItem!.purchaseOrderId).toEqual(fakePurchaseOrderItem.purchaseOrderId);
      expect(purchaseOrderItem!.product).toEqual(new Product(
        fakePurchaseOrderItem.product.id,
        fakePurchaseOrderItem.product.name,
        fakePurchaseOrderItem.product.amount,
      ));

      expect(prismaMock.purchaseOrderItem.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.purchaseOrderItem.findFirst).toHaveBeenCalledWith({
        where: { purchaseOrderId: fakePurchaseOrderId },
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

    it('gets a purchase order item by product id', async () => {
      expect.assertions(7);

      const fakeProductId = faker.datatype.uuid();

      const fakePurchaseOrderItem = {
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number().toString(), 10),
        purchaseOrderId: faker.datatype.uuid(),
        product: {
          id: fakeProductId,
          name: faker.commerce.product(),
          amount: faker.datatype.float(),
        },
      };

      prismaMock.purchaseOrderItem.findFirst.mockResolvedValueOnce(fakePurchaseOrderItem as any);

      const repository = new PrismaPurchaseOrderRepository();

      const purchaseOrderItem = await repository.getPurchaseOrderItem({
        productId: fakeProductId,
      });

      expect(purchaseOrderItem!.id).toEqual(fakePurchaseOrderItem.id);
      expect(purchaseOrderItem!.quantity).toEqual(fakePurchaseOrderItem.quantity);
      expect(purchaseOrderItem!.purchaseOrderId).toEqual(fakePurchaseOrderItem.purchaseOrderId);
      expect(purchaseOrderItem!.purchaseOrderId).toEqual(fakePurchaseOrderItem.purchaseOrderId);
      expect(purchaseOrderItem!.product).toEqual(new Product(
        fakePurchaseOrderItem.product.id,
        fakePurchaseOrderItem.product.name,
        fakePurchaseOrderItem.product.amount,
      ));

      expect(prismaMock.purchaseOrderItem.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.purchaseOrderItem.findFirst).toHaveBeenCalledWith({
        where: { productId: fakeProductId },
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

    it('throws a generic exception if neither purchaseOrderId or productId is passed', async () => {
      expect.assertions(1);

      const repository = new PrismaPurchaseOrderRepository();

      try {
        await repository.getPurchaseOrderItem({});
      } catch (e: any) {
        expect(e.message).toEqual('É preciso passar o ID do pedido ou do produto.');
      }
    });
  });

  describe('PrismaPurchaseOrderRepository.addPurchaseOrderItem()', () => {
    it('creates a new purchase order item', async () => {
      expect.assertions(7);

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

      prismaMock.purchaseOrderItem.create.mockResolvedValueOnce(fakePurchaseOrderItem as any);

      const repository = new PrismaPurchaseOrderRepository();

      const purchaseOrderItem = await repository.addPurchaseOrderItem(
        new PurchaseOrderItem({
          id: fakePurchaseOrderItem.id,
          purchaseOrderId: fakePurchaseOrderItem.purchaseOrderId,
          quantity: fakePurchaseOrderItem.quantity,
          product: new Product(
            fakePurchaseOrderItem.product.id,
            fakePurchaseOrderItem.product.name,
            fakePurchaseOrderItem.product.amount,
          ),
        }),
      );

      expect(purchaseOrderItem!.id).toEqual(fakePurchaseOrderItem.id);
      expect(purchaseOrderItem!.quantity).toEqual(fakePurchaseOrderItem.quantity);
      expect(purchaseOrderItem!.purchaseOrderId).toEqual(fakePurchaseOrderItem.purchaseOrderId);
      expect(purchaseOrderItem!.purchaseOrderId).toEqual(fakePurchaseOrderItem.purchaseOrderId);
      expect(purchaseOrderItem!.product).toEqual(new Product(
        fakePurchaseOrderItem.product.id,
        fakePurchaseOrderItem.product.name,
        fakePurchaseOrderItem.product.amount,
      ));

      expect(prismaMock.purchaseOrderItem.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.purchaseOrderItem.create).toHaveBeenCalledWith({
        data: {
          id: fakePurchaseOrderItem.id,
          purchaseOrderId: fakePurchaseOrderItem.purchaseOrderId,
          quantity: fakePurchaseOrderItem.quantity,
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
  });

  describe('PrismaPurchaseOrderRepository.updatePurchaseOrderItem()', () => {
    it('updates a specific purchase order item', async () => {
      expect.assertions(7);

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

      prismaMock.purchaseOrderItem.update.mockResolvedValueOnce(fakePurchaseOrderItem as any);

      const repository = new PrismaPurchaseOrderRepository();

      const purchaseOrderItem = await repository.updatePurchaseOrderItem(
        new PurchaseOrderItem({
          id: fakePurchaseOrderItem.id,
          purchaseOrderId: fakePurchaseOrderItem.purchaseOrderId,
          quantity: fakePurchaseOrderItem.quantity,
          product: new Product(
            fakePurchaseOrderItem.product.id,
            fakePurchaseOrderItem.product.name,
            fakePurchaseOrderItem.product.amount,
          ),
        }),
      );

      expect(purchaseOrderItem!.id).toEqual(fakePurchaseOrderItem.id);
      expect(purchaseOrderItem!.quantity).toEqual(fakePurchaseOrderItem.quantity);
      expect(purchaseOrderItem!.purchaseOrderId).toEqual(fakePurchaseOrderItem.purchaseOrderId);
      expect(purchaseOrderItem!.purchaseOrderId).toEqual(fakePurchaseOrderItem.purchaseOrderId);
      expect(purchaseOrderItem!.product).toEqual(new Product(
        fakePurchaseOrderItem.product.id,
        fakePurchaseOrderItem.product.name,
        fakePurchaseOrderItem.product.amount,
      ));

      expect(prismaMock.purchaseOrderItem.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.purchaseOrderItem.update).toHaveBeenCalledWith({
        where: { id: fakePurchaseOrderItem.id },
        data: {
          purchaseOrderId: fakePurchaseOrderItem.purchaseOrderId,
          quantity: fakePurchaseOrderItem.quantity,
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
  });

  describe('PrismaPurchaseOrderRepository.deletePurchaseOrderItem()', () => {
    it('deletes a purchas order item by id', async () => {
      expect.assertions(3);

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

      const result = await repository.deletePurchaseOrderItem(fakePurchaseOrderItem.id);

      expect(result).toBe(true);
      expect(prismaMock.purchaseOrderItem.delete).toHaveBeenCalledTimes(1);
      expect(prismaMock.purchaseOrderItem.delete).toHaveBeenCalledWith({
        where: { id: fakePurchaseOrderItem.id },
      });
    });

    it('returns FALSE if occur an expected error', async () => {
      expect.assertions(3);

      const fakePurchaseOrderItemId = faker.datatype.uuid();

      prismaMock.purchaseOrderItem.delete.mockRejectedValueOnce(new Error('Test'));

      const repository = new PrismaPurchaseOrderRepository();

      const result = await repository.deletePurchaseOrderItem(fakePurchaseOrderItemId);

      expect(result).toBe(false);
      expect(prismaMock.purchaseOrderItem.delete).toHaveBeenCalledTimes(1);
      expect(prismaMock.purchaseOrderItem.delete).toHaveBeenCalledWith({
        where: { id: fakePurchaseOrderItemId },
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
  });
});
