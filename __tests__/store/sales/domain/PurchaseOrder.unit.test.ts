import { faker } from '@faker-js/faker';
import PurchaseOrder, { PurchaseOrderProps, PurchaseOrderStatus } from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import DomainError from '@shared/errors/DomainError';

describe("PurchaseOrder's unit tests", () => {
  describe('PurchaseOrder.createDraft()', () => {
    it('creates a draft purchase order', () => {
      const props: PurchaseOrderProps = {
        id: faker.datatype.uuid(),
        customerId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
        voucher: null,
        status: null,
        items: [],
      };

      const draftPurchaseOrder = PurchaseOrder.createDraft(props);

      expect(draftPurchaseOrder.status).toEqual(PurchaseOrderStatus.DRAFT);
    });
  });

  describe('PurchaseOrder.addItem()', () => {
    it('adds a new purchase order item', () => {
      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        customerId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
        voucher: null,
        status: null,
        items: [],
      });

      const calculateTotalAmountSpy = jest.spyOn(purchaseOrder, 'calculateTotalAmount');

      const purchaseOrderItem = new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        purchaseOrderId: faker.datatype.uuid(),
        product: {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          amount: faker.datatype.float(),
        },
      });

      purchaseOrder.addItem(purchaseOrderItem);

      expect(purchaseOrder.items).toHaveLength(1);
      expect(purchaseOrder.items[0]).toEqual(purchaseOrderItem);
      expect(calculateTotalAmountSpy).toHaveBeenCalledTimes(1);
    });

    it('increments the quantity of an existing purchase order item', () => {
      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        customerId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
        voucher: null,
        status: null,
        items: [],
      });

      const calculateTotalAmountSpy = jest.spyOn(purchaseOrder, 'calculateTotalAmount');

      const params = {
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        purchaseOrderId: faker.datatype.uuid(),
        product: {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          amount: faker.datatype.float(),
        },
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
      expect.assertions(1);

      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        customerId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
        voucher: null,
        status: null,
        items: [],
      });

      const purchaseOrderItem = new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        purchaseOrderId: faker.datatype.uuid(),
        product: {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          amount: faker.datatype.float(),
        },
      });

      expect(() => {
        purchaseOrder.removeItem(purchaseOrderItem);
      }).toThrow(DomainError);
    });

    it('removes a purchase order item', () => {
      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        customerId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
        voucher: null,
        status: null,
        items: [],
      });

      const purchaseOrderItem = new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        purchaseOrderId: faker.datatype.uuid(),
        product: {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          amount: faker.datatype.float(),
        },
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
      expect.assertions(1);

      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        customerId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
        voucher: null,
        status: null,
        items: [],
      });

      const fakePurchaseOrderItemId = faker.datatype.uuid();

      expect(() => {
        purchaseOrder.updateItemQuantity(fakePurchaseOrderItemId, 10);
      }).toThrow(DomainError);
    });

    it('updates purchase order item quantity', () => {
      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        customerId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
        voucher: null,
        status: null,
        items: [],
      });

      const purchaseOrderItem = new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        purchaseOrderId: faker.datatype.uuid(),
        product: {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          amount: faker.datatype.float(),
        },
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
        customerId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
        voucher: null,
        status: null,
        items: [],
      });

      const purchaseOrderItems = [
        new PurchaseOrderItem({
          id: faker.datatype.uuid(),
          quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
          purchaseOrderId: faker.datatype.uuid(),
          product: {
            id: faker.datatype.uuid(),
            name: faker.commerce.product(),
            amount: faker.datatype.float(),
          },
        }),
        new PurchaseOrderItem({
          id: faker.datatype.uuid(),
          quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
          purchaseOrderId: faker.datatype.uuid(),
          product: {
            id: faker.datatype.uuid(),
            name: faker.commerce.product(),
            amount: faker.datatype.float(),
          },
        }),
        new PurchaseOrderItem({
          id: faker.datatype.uuid(),
          quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
          purchaseOrderId: faker.datatype.uuid(),
          product: {
            id: faker.datatype.uuid(),
            name: faker.commerce.product(),
            amount: faker.datatype.float(),
          },
        }),
      ];

      let expectedTotalAmount = 0;
      for (let i = 0, len = purchaseOrderItems.length; i < len; i += 1) {
        const item = purchaseOrderItems[i];
        purchaseOrder.addItem(item);
        expectedTotalAmount += item.quantity * item.product.amount;
      }

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
        customerId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
        voucher: null,
        status: null,
        items: [],
      });

      const purchaseOrderItem = new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        purchaseOrderId: faker.datatype.uuid(),
        product: {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          amount: faker.datatype.float(),
        },
      });

      purchaseOrder.addItem(purchaseOrderItem);

      const result = purchaseOrder.hasItem(purchaseOrderItem);

      expect(result).toEqual(true);
    });

    it("returns FALSE if purchase order item doesn't exist", () => {
      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        customerId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
        voucher: null,
        status: null,
        items: [],
      });

      const purchaseOrderItem = new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        purchaseOrderId: faker.datatype.uuid(),
        product: {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          amount: faker.datatype.float(),
        },
      });

      const result = purchaseOrder.hasItem(purchaseOrderItem);

      expect(result).toEqual(false);
    });
  });

  describe('PurchaseOrder.makeDraft()', () => {
    it('changes status to draft', () => {
      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        customerId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
        status: PurchaseOrderStatus.STARTED,
        voucher: null,
        items: [],
      });

      purchaseOrder.makeDraft();

      expect(purchaseOrder.status).toEqual(PurchaseOrderStatus.DRAFT);
    });
  });

  describe('PurchaseOrder.start()', () => {
    it('changes status to started', () => {
      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        customerId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
        status: PurchaseOrderStatus.DRAFT,
        voucher: null,
        items: [],
      });

      purchaseOrder.start();

      expect(purchaseOrder.status).toEqual(PurchaseOrderStatus.STARTED);
    });
  });

  describe('PurchaseOrder.finish()', () => {
    it('changes status to paid', () => {
      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        customerId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
        status: PurchaseOrderStatus.STARTED,
        voucher: null,
        items: [],
      });

      purchaseOrder.finish();

      expect(purchaseOrder.status).toEqual(PurchaseOrderStatus.PAID);
    });
  });

  describe('PurchaseOrder.cancel()', () => {
    it('changes status to canceled', () => {
      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        customerId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
        status: PurchaseOrderStatus.STARTED,
        voucher: null,
        items: [],
      });

      purchaseOrder.cancel();

      expect(purchaseOrder.status).toEqual(PurchaseOrderStatus.CANCELED);
    });
  });
});
