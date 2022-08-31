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

      const purchaseOrder = {
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

      prismaMock.purchaseOrder.findUnique.mockResolvedValueOnce(purchaseOrder as any);

      const repository = new PrismaPurchaseOrderRepository();

      const findedPurchaseOrder = await repository.getPurchaseOrderById(purchaseOrderId);

      expect(findedPurchaseOrder!.id).toEqual(purchaseOrder.id);
      expect(findedPurchaseOrder!.clientId).toEqual(purchaseOrder.clientId);
      expect(findedPurchaseOrder!.code).toEqual(purchaseOrder.code);
      expect(findedPurchaseOrder!.createdAt).toEqual(purchaseOrder.createdAt);
      expect(findedPurchaseOrder!.discountAmount).toEqual(purchaseOrder.discountAmount);
      expect(findedPurchaseOrder!.voucher!.id).toEqual(purchaseOrder.voucher.id);
      expect(findedPurchaseOrder!.voucher!.active).toEqual(purchaseOrder.voucher.active);
      expect(findedPurchaseOrder!.voucher!.code).toEqual(purchaseOrder.voucher.code);
      expect(findedPurchaseOrder!.voucher!.type).toEqual(purchaseOrder.voucher.type);
      expect(findedPurchaseOrder!.voucher!.percentageAmount)
        .toEqual(purchaseOrder.voucher.percentageAmount);
      expect(findedPurchaseOrder!.voucher!.rawDiscountAmount)
        .toEqual(purchaseOrder.voucher.rawDiscountAmount);
      expect(findedPurchaseOrder!.voucher!.createdAt).toEqual(purchaseOrder.voucher.createdAt);
      expect(findedPurchaseOrder!.voucher!.expiresAt).toEqual(purchaseOrder.voucher.expiresAt);
      expect(findedPurchaseOrder!.voucher!.usedAt).toEqual(null);

      findedPurchaseOrder!.items.forEach((item, index) => {
        expect(item.id).toEqual(purchaseOrder.items[index].id);
        expect(item.product.id).toEqual(purchaseOrder.items[index].product.id);
        expect(item.product.name).toEqual(purchaseOrder.items[index].product.name);
        expect(item.product.amount).toEqual(purchaseOrder.items[index].product.amount);
        expect(item.quantity).toEqual(purchaseOrder.items[index].quantity);
        expect(item.purchaseOrderId).toEqual(purchaseOrder.items[index].purchaseOrderId);
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
