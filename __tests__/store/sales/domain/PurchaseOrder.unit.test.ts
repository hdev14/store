import { faker } from '@faker-js/faker';
import Product from '@sales/domain/Product';
import PurchaseOrder, { PurchaseOrderParams, PurchaseOrderStatus } from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import DomainError from '@shared/errors/DomainError';

describe("PurchaseOrder's unit tests", () => {
  describe('PurchaseOrder.createDraft()', () => {
    it('creates a draft purchase order', () => {
      const params: PurchaseOrderParams = {
        id: faker.datatype.uuid(),
        clientId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
      };

      const draftPurchaseOrder = PurchaseOrder.createDraft(params);

      expect(draftPurchaseOrder).toEqual({
        ...params,
        status: PurchaseOrderStatus.DRAFT,
        voucher: undefined,
        discountAmount: 0,
        totalAmount: 0,
        _items: [],
      });
    });
  });

  describe('PurchaseOrder.addItem()', () => {
    it('adds a new purchase order item', () => {
      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        clientId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
      });

      const calculateTotalAmountSpy = jest.spyOn(purchaseOrder, 'calculateTotalAmount');

      const purchaseOrderItem = new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        purchaseOrderId: faker.datatype.uuid(),
        product: new Product(
          faker.datatype.uuid(),
          faker.commerce.product(),
          faker.datatype.float(),
        ),
      });

      purchaseOrder.addItem(purchaseOrderItem);

      expect(purchaseOrder.items).toHaveLength(1);
      expect(purchaseOrder.items[0]).toEqual(purchaseOrderItem);
      expect(calculateTotalAmountSpy).toHaveBeenCalledTimes(1);
    });

    it('increments the quantity of an existing purchase order item', () => {
      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        clientId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
      });

      const calculateTotalAmountSpy = jest.spyOn(purchaseOrder, 'calculateTotalAmount');

      const params = {
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        purchaseOrderId: faker.datatype.uuid(),
        product: new Product(
          faker.datatype.uuid(),
          faker.commerce.product(),
          faker.datatype.float(),
        ),
      };

      const purchaseOrderItem = new PurchaseOrderItem(params);
      const clonePurchaseOrderItem = new PurchaseOrderItem({
        ...params,
        quantity: 1,
      });

      purchaseOrder.addItem(purchaseOrderItem);
      purchaseOrder.addItem(clonePurchaseOrderItem);

      expect(purchaseOrder.items).toHaveLength(1);
      expect(purchaseOrder.items[0].quantity).toEqual(params.quantity + 1);
      expect(calculateTotalAmountSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('PurchaseOrder.removeItem()', () => {
    it("throws an exception of type DomainError if purchase order item doesn't exist", () => {
      expect.assertions(2);

      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        clientId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
      });

      const purchaseOrderItem = new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        purchaseOrderId: faker.datatype.uuid(),
        product: new Product(
          faker.datatype.uuid(),
          faker.commerce.product(),
          faker.datatype.float(),
        ),
      });

      try {
        purchaseOrder.removeItem(purchaseOrderItem);
      } catch (e: any) {
        expect(e).toBeInstanceOf(DomainError);
        expect(e.message).toEqual('Item do pedido não encontrado.');
      }
    });

    it('removes a purchase order item', () => {
      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        clientId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
      });

      const purchaseOrderItem = new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        purchaseOrderId: faker.datatype.uuid(),
        product: new Product(
          faker.datatype.uuid(),
          faker.commerce.product(),
          faker.datatype.float(),
        ),
      });

      purchaseOrder.addItem(purchaseOrderItem);

      const calculateTotalAmountSpy = jest.spyOn(purchaseOrder, 'calculateTotalAmount');

      purchaseOrder.removeItem(purchaseOrderItem);

      expect(purchaseOrder.items).toHaveLength(0);
      expect(calculateTotalAmountSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('PurchaseOrder.updateItemQuantity()', () => {
    it("throws an exception of type DomainError if item does't exist", () => {
      expect.assertions(2);

      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        clientId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
      });

      const fakePurchaseOrderItemId = faker.datatype.uuid();

      try {
        purchaseOrder.updateItemQuantity(fakePurchaseOrderItemId, 10);
      } catch (e: any) {
        expect(e).toBeInstanceOf(DomainError);
        expect(e.message).toEqual('Item do pedido não encontrado.');
      }
    });

    it('updates purchase order item quantity', () => {
      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        clientId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
      });

      const purchaseOrderItem = new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        purchaseOrderId: faker.datatype.uuid(),
        product: new Product(
          faker.datatype.uuid(),
          faker.commerce.product(),
          faker.datatype.float(),
        ),
      });

      purchaseOrder.addItem(purchaseOrderItem);

      const calculateTotalAmountSpy = jest.spyOn(purchaseOrder, 'calculateTotalAmount');

      purchaseOrder.updateItemQuantity(purchaseOrderItem.id, 10);

      expect(purchaseOrder.items[0].quantity).toEqual(10);
      expect(calculateTotalAmountSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('PurchaseOrder.calculateTotalAmount()', () => {
    it('calculates the total amount of all items', () => {
      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        clientId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
      });

      const purchaseOrderItems = [
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
      ];

      purchaseOrderItems.forEach((item) => purchaseOrder.addItem(item));

      const expectedTotalAmount = purchaseOrderItems.reduce(
        (acc, item) => acc + (item.quantity * item.product.amount),
        0,
      );

      const calculateTotalDiscountAmountSpy = jest.spyOn(purchaseOrder, 'calculateTotalDiscountAmount');

      purchaseOrder.calculateTotalAmount();

      expect(purchaseOrder.totalAmount).toEqual(expectedTotalAmount);
      expect(calculateTotalDiscountAmountSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('PurchaseOrder.hasItem()', () => {
    it('returns TRUE if purchase order item exists', () => {
      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        clientId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
      });

      const purchaseOrderItem = new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        purchaseOrderId: faker.datatype.uuid(),
        product: new Product(
          faker.datatype.uuid(),
          faker.commerce.product(),
          faker.datatype.float(),
        ),
      });

      purchaseOrder.addItem(purchaseOrderItem);

      const result = purchaseOrder.hasItem(purchaseOrderItem);

      expect(result).toEqual(true);
    });

    it("returns FALSE if purchase order item doesn't exist", () => {
      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        clientId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
      });

      const purchaseOrderItem = new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        purchaseOrderId: faker.datatype.uuid(),
        product: new Product(
          faker.datatype.uuid(),
          faker.commerce.product(),
          faker.datatype.float(),
        ),
      });

      const result = purchaseOrder.hasItem(purchaseOrderItem);

      expect(result).toEqual(false);
    });
  });

  describe('PurchaseOrder.makeDraft()', () => {
    it('changes status to draft', () => {
      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        clientId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
        status: PurchaseOrderStatus.STARTED,
      });

      purchaseOrder.makeDraft();

      expect(purchaseOrder.status).toEqual(PurchaseOrderStatus.DRAFT);
    });
  });

  describe('PurchaseOrder.start()', () => {
    it('changes status to started', () => {
      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        clientId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
        status: PurchaseOrderStatus.DRAFT,
      });

      purchaseOrder.start();

      expect(purchaseOrder.status).toEqual(PurchaseOrderStatus.STARTED);
    });
  });

  describe('PurchaseOrder.finish()', () => {
    it('changes status to paid', () => {
      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        clientId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
        status: PurchaseOrderStatus.STARTED,
      });

      purchaseOrder.finish();

      expect(purchaseOrder.status).toEqual(PurchaseOrderStatus.PAID);
    });
  });

  describe('PurchaseOrder.cancel()', () => {
    it('changes status to canceled', () => {
      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        clientId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
        status: PurchaseOrderStatus.STARTED,
      });

      purchaseOrder.cancel();

      expect(purchaseOrder.status).toEqual(PurchaseOrderStatus.CANCELED);
    });
  });
});
