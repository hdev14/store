import { faker } from '@faker-js/faker';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import DomainError from '@shared/errors/DomainError';

describe("PurchaseOrderItem's unit tests", () => {
  describe('PurchaseOrderItem.setPurchaseOrder()', () => {
    it('changes purchaseOrderId', () => {
      const purchaseOrderItem = new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        product: {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          amount: faker.datatype.float(),
        },
      });

      const fakePurchaseOrderId = faker.datatype.uuid();

      purchaseOrderItem.setPurchaseOrder(fakePurchaseOrderId);

      expect(purchaseOrderItem.purchase_order_id).toEqual(fakePurchaseOrderId);
    });
  });

  describe('PurchaseOrderItem.calculateAmount()', () => {
    it('calculates purchase order item amount', () => {
      const purchaseOrderItem = new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        product: {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          amount: 10,
        },
      });

      const expectedAmount = purchaseOrderItem.quantity * 10;

      const amount = purchaseOrderItem.calculateAmount();

      expect(amount).toEqual(expectedAmount);
    });
  });

  describe('PurchaseOrderItem.addQuantity()', () => {
    it('throws an exception of type DomainError if quantity is negative', () => {
      expect.assertions(1);

      const purchaseOrderItem = new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        product: {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          amount: 10,
        },
      });

      expect(() => {
        purchaseOrderItem.addQuantity(faker.datatype.number() * (-1));
      }).toThrow(DomainError);
    });

    it('adds quantity to a purchase order item', () => {
      const purchaseOrderItem = new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        product: {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          amount: 10,
        },
      });

      const currentQuantity = purchaseOrderItem.quantity;

      purchaseOrderItem.addQuantity(10);

      expect(purchaseOrderItem.quantity).toEqual(currentQuantity + 10);
    });
  });

  describe('PurchaseOrderItem.updateQuantity()', () => {
    it('throws an exception of type DomainError if quantity is negative', () => {
      expect.assertions(1);

      const purchaseOrderItem = new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        product: {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          amount: 10,
        },
      });

      expect(() => {
        purchaseOrderItem.updateQuantity(faker.datatype.number() * (-1));
      }).toThrow(DomainError);
    });

    it("updates the purchase order item's quantity", () => {
      const purchaseOrderItem = new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        product: {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          amount: 10,
        },
      });

      purchaseOrderItem.updateQuantity(10);

      expect(purchaseOrderItem.quantity).toEqual(10);
    });
  });
});
