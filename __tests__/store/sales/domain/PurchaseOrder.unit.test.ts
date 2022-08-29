import { faker } from '@faker-js/faker';
import Product from '@sales/domain/Product';
import PurchaseOrder, { PurchaseOrderParams, PurchaseOrderStatus } from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import DomainError from '@shared/errors/DomainError';

describe("PurchaseOrder's unit tests", () => {
  describe('createDraft', () => {
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

  describe('addItem', () => {
    it('adds a new purchase order item', () => {
      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        clientId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
      });

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

      purchaseOrder.addItem(purchaseOrderItem);

      expect(purchaseOrder.items).toHaveLength(1);
      expect(purchaseOrder.items[0]).toEqual(purchaseOrderItem);
    });

    it('increments the quantity of an existing purchase order item', () => {
      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        clientId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
      });

      const params = {
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number().toString(), 10),
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
    });
  });

  describe('removeItem', () => {
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
        quantity: parseInt(faker.datatype.number().toString(), 10),
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
  });
});
