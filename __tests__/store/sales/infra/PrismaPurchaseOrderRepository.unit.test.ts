import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import Product from '@sales/domain/Product';
import PurchaseOrder, { PurchaseOrderStatus } from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import Voucher, { VoucherDiscountTypes } from '@sales/domain/Voucher';
import PrismaPurchaseOrderRepository from '@sales/infra/PrismaPurchaseOrderRepository';
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
    it('returns a purchase order by client id', async () => {
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

  });

  describe('PrismaPurchaseOrderRepository.addPurchaseOrder()', () => {

  });

  describe('PrismaPurchaseOrderRepository.updatePurchaseOrder()', () => {

  });

  describe('PrismaPurchaseOrderRepository.getPurchaseOrderItemById()', () => {

  });

  describe('PrismaPurchaseOrderRepository.getPurchaseOrderItem()', () => {

  });

  describe('PrismaPurchaseOrderRepository.addPurchaseOrderItem()', () => {

  });

  describe('PrismaPurchaseOrderRepository.updatePurchaseOrderItem()', () => {

  });

  describe('PrismaPurchaseOrderRepository.deletePurchaseOrderItem()', () => {

  });

  describe('PrismaPurchaseOrderRepository.getVoucherByCode()', () => {

  });
});
