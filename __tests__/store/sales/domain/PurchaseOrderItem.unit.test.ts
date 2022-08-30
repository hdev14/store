import { faker } from '@faker-js/faker';
import Product from '@sales/domain/Product';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import DomainError from '@shared/errors/DomainError';

describe("PurchaseOrderItem's unit tests", () => {
  describe('PurchaseOrderItem.setPurchaseOrder()', () => {
    it('changes purchaseOrderId', () => {
      const purchaseOrderItem = new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        product: new Product(
          faker.datatype.uuid(),
          faker.commerce.product(),
          faker.datatype.float(),
        ),
      });

      const fakePurchaseOrderId = faker.datatype.uuid();

      purchaseOrderItem.setPurchaseOrder(fakePurchaseOrderId);

      expect(purchaseOrderItem.purchaseOrderId).toEqual(fakePurchaseOrderId);
    });
  });

  describe('PurchaseOrderItem.calculateAmount()', () => {
    it('calculates purchase order item amount', () => {
      const purchaseOrderItem = new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        product: new Product(
          faker.datatype.uuid(),
          faker.commerce.product(),
          10,
        ),
      });

      const expectedAmount = purchaseOrderItem.quantity * 10;

      const amount = purchaseOrderItem.calculateAmount();

      expect(amount).toEqual(expectedAmount);
    });
  });

  describe('PurchaseOrderItem.addQuantity()', () => {
    it('throws an exception of type DomainError if quantity is negative', () => {
      expect.assertions(2);

      const purchaseOrderItem = new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        product: new Product(
          faker.datatype.uuid(),
          faker.commerce.product(),
          10,
        ),
      });

      try {
        purchaseOrderItem.addQuantity(faker.datatype.number() * (-1));
      } catch (e: any) {
        expect(e).toBeInstanceOf(DomainError);
        expect(e.message).toEqual('Não é possível adicionar uma quantidade negativa de itens.');
      }
    });

    it('adds quantity to a purchase order item', () => {
      const purchaseOrderItem = new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        product: new Product(
          faker.datatype.uuid(),
          faker.commerce.product(),
          10,
        ),
      });

      const currentQuantity = purchaseOrderItem.quantity;

      purchaseOrderItem.addQuantity(10);

      expect(purchaseOrderItem.quantity).toEqual(currentQuantity + 10);
    });
  });

  describe('PurchaseOrderItem.updateQuantity()', () => {
    it('throws an exception of type DomainError if quantity is negative', () => {
      expect.assertions(2);

      const purchaseOrderItem = new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        product: new Product(
          faker.datatype.uuid(),
          faker.commerce.product(),
          10,
        ),
      });

      try {
        purchaseOrderItem.updateQuantity(faker.datatype.number() * (-1));
      } catch (e: any) {
        expect(e).toBeInstanceOf(DomainError);
        expect(e.message).toEqual('Não é possível adicionar uma quantidade negativa de itens.');
      }
    });

    it("updates the purchase order item's quantity", () => {
      const purchaseOrderItem = new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        product: new Product(
          faker.datatype.uuid(),
          faker.commerce.product(),
          10,
        ),
      });

      purchaseOrderItem.updateQuantity(10);

      expect(purchaseOrderItem.quantity).toEqual(10);
    });
  });
});
