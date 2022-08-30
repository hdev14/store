import { faker } from '@faker-js/faker';
import Product from '@sales/domain/Product';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';

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
});
