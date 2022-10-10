import { faker } from '@faker-js/faker';
import Mongo from '@mongo/index';
import { CategoryModel, ProductModel, UserModel } from '@mongo/models';
import { PurchaseOrderStatus } from '@sales/domain/PurchaseOrder';
import { VoucherDiscountTypes } from '@sales/domain/Voucher';

describe('Sales Integration Tests', () => {
  describe('POST: /sales/orders/items', () => {
    let product: any;
    let user: any;

    beforeAll(async () => {
      const userData = {
        id: faker.datatype.uuid(),
        name: faker.name.fullName(),
      };

      user = await globalThis.dbConnection.user.create({
        data: {
          id: faker.datatype.uuid(),
          name: faker.name.fullName(),
        },
      });

      await UserModel.create({
        ...userData,
        _id: userData.id,
      });

      const categoryData = {
        id: faker.datatype.uuid(),
        name: faker.word.verb(),
        code: parseInt(faker.random.numeric(5), 10),
      };

      const category = await globalThis.dbConnection.category.create({
        data: categoryData,
      });

      await CategoryModel.create({
        ...categoryData,
        _id: categoryData.id,
      });

      const productData = {
        id: faker.datatype.uuid(),
        name: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        amount: faker.datatype.float(100),
        active: faker.datatype.boolean(),
        depth: faker.datatype.number(50),
        height: faker.datatype.number(50),
        width: faker.datatype.number(50),
        stockQuantity: 0,
        image: faker.internet.url(),
        createdAt: new Date(),
        categoryId: category.id,
      };

      product = await globalThis.dbConnection.product.create({
        data: productData,
      });

      await ProductModel.create({
        ...productData,
        _id: productData.id,
      });
    });

    afterAll(async () => {
      await globalThis.dbConnection.$transaction([
        globalThis.dbConnection.purchaseOrderItem.deleteMany({}),
        globalThis.dbConnection.purchaseOrder.deleteMany({}),
        globalThis.dbConnection.product.deleteMany({}),
        globalThis.dbConnection.category.deleteMany({}),
        globalThis.dbConnection.user.deleteMany({}),
      ]);

      await Mongo.dropCollections();
    });

    it('returns 400 if data is invalid', async () => {
      expect.assertions(2);

      const data = {
        customerId: 'wrong',
        productId: 'wrong',
        productName: 123,
        productAmount: 'wrong',
        quantity: 'wrong',
      };

      const response = await globalThis.request
        .post('/sales/orders/items')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(data);

      expect(response.status).toEqual(400);
      expect(response.body.errors).toHaveLength(5);
    });

    it('creates a new draft purchase order with an item', async () => {
      expect.assertions(8);

      const data = {
        customerId: user.id,
        productId: product.id,
        productName: product.name,
        productAmount: product.amount,
        quantity: 1,
      };

      const response = await globalThis.request
        .post('/sales/orders/items')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(data);

      expect(response.status).toEqual(201);
      expect(response.body.message).toEqual('Item adicionado ao pedido.');

      const purchaseOrder = await globalThis.dbConnection.purchaseOrder.findFirst({
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

      expect(purchaseOrder).toBeTruthy();
      expect(purchaseOrder!.status).toEqual(PurchaseOrderStatus.DRAFT);
      expect(purchaseOrder!.items[0].quantity).toEqual(1);
      expect(purchaseOrder!.items[0].product.id).toEqual(product.id);
      expect(purchaseOrder!.items[0].product.name).toEqual(product.name);
      expect(purchaseOrder!.items[0].product.amount).toEqual(product.amount);
    });

    it('returns 422 if AddPurchaseOrderItemCommand returns FALSE', async () => {
      expect.assertions(2);

      // to simulate an expected error.
      const fakeUserId = faker.datatype.uuid();

      const data = {
        customerId: fakeUserId,
        productId: product.id,
        productName: product.name,
        productAmount: product.amount,
        quantity: 1,
      };

      const response = await globalThis.request
        .post('/sales/orders/items')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(data);

      expect(response.status).toEqual(422);
      expect(response.body.message).toEqual('Não foi possível adicionar o item ao pedido.');
    });
  });

  describe('DELETE: /sales/orders/items/:id', () => {
    const fakePurchaseOrderItemId = faker.datatype.uuid();

    beforeAll(async () => {
      const fakeCustomerId = faker.datatype.uuid();
      const fakeProductId = faker.datatype.uuid();
      const fakePurchaseOrderId = faker.datatype.uuid();
      const fakeCategoryId = faker.datatype.uuid();

      await globalThis.dbConnection.user.create({
        data: {
          id: fakeCustomerId,
          name: faker.name.fullName(),
        },
      });

      await globalThis.dbConnection.category.create({
        data: {
          id: fakeCategoryId,
          code: parseInt(faker.datatype.number().toString(), 10),
          name: faker.word.adjective(),
        },
      });

      await globalThis.dbConnection.product.create({
        data: {
          id: fakeProductId,
          name: faker.commerce.product(),
          description: faker.commerce.productDescription(),
          amount: faker.datatype.float(100),
          active: faker.datatype.boolean(),
          depth: faker.datatype.number(50),
          height: faker.datatype.number(50),
          width: faker.datatype.number(50),
          stockQuantity: parseInt(faker.datatype.number(100).toString(), 10),
          image: faker.internet.url(),
          createdAt: new Date(),
          categoryId: fakeCategoryId,
        },
      });

      await globalThis.dbConnection.purchaseOrder.create({
        data: {
          id: fakePurchaseOrderId,
          code: parseInt(faker.datatype.number().toString(), 10),
          totalAmount: faker.datatype.float(),
          discountAmount: faker.datatype.float(),
          status: PurchaseOrderStatus.DRAFT,
          customerId: fakeCustomerId,
          createdAt: new Date(),
        },
      });

      await globalThis.dbConnection.purchaseOrderItem.create({
        data: {
          id: fakePurchaseOrderItemId,
          quantity: parseInt(faker.datatype.number().toString(), 10),
          productId: fakeProductId,
          purchaseOrderId: fakePurchaseOrderId,
        },
      });
    });

    afterAll(async () => {
      await globalThis.dbConnection.$transaction([
        globalThis.dbConnection.purchaseOrder.deleteMany({}),
        globalThis.dbConnection.product.deleteMany({}),
        globalThis.dbConnection.category.deleteMany({}),
        globalThis.dbConnection.user.deleteMany({}),
      ]);
    });

    it('returns 200 if purchase order item was deleted', async () => {
      expect.assertions(3);

      const response = await globalThis.request
        .delete(`/sales/orders/items/${fakePurchaseOrderItemId}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send();

      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual('Item excluido com sucesso.');

      const exists = await globalThis.dbConnection.purchaseOrderItem.findUnique({
        where: { id: fakePurchaseOrderItemId },
      });

      expect(exists).toBeNull();
    });

    it('returns 400 if purchase order item id is invalid', async () => {
      expect.assertions(2);

      const invalidPurchaseOrderItemId = 'wrong';

      const response = await globalThis.request
        .delete(`/sales/orders/items/${invalidPurchaseOrderItemId}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send();

      expect(response.status).toEqual(400);
      expect(response.body.errors).toHaveLength(1);
    });

    it('returns 422 when was not possible to delete the purchase order item', async () => {
      expect.assertions(2);

      const noexistentPurchaseOrderItemId = faker.datatype.uuid();

      const response = await globalThis.request
        .delete(`/sales/orders/items/${noexistentPurchaseOrderItemId}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send();

      expect(response.status).toEqual(422);
      expect(response.body.message).toEqual('Não foi possível excluir o item.');
    });
  });

  describe('POST: /sales/orders/:id/voucher', () => {
    const fakeCustomerId = faker.datatype.uuid();
    const fakePurchaseOrderId = faker.datatype.uuid();
    const fakeVoucherCode = parseInt(faker.datatype.number().toString(), 10);
    const fakeDeactivedVoucherCode = parseInt(faker.datatype.number().toString(), 10);
    const fakeExpiredVoucherCode = parseInt(faker.datatype.number().toString(), 10);

    beforeAll(async () => {
      await globalThis.dbConnection.user.create({
        data: {
          id: fakeCustomerId,
          name: faker.name.fullName(),
        },
      });

      await globalThis.dbConnection.purchaseOrder.create({
        data: {
          id: fakePurchaseOrderId,
          code: parseInt(faker.datatype.number().toString(), 10),
          totalAmount: faker.datatype.float(),
          discountAmount: faker.datatype.float(),
          status: PurchaseOrderStatus.DRAFT,
          customerId: fakeCustomerId,
          createdAt: new Date(),
        },
      });

      await globalThis.dbConnection.voucher.create({
        data: {
          id: faker.datatype.uuid(),
          active: true,
          code: fakeVoucherCode,
          quantity: 10,
          type: VoucherDiscountTypes.ABSOLUTE,
          rawDiscountAmount: faker.datatype.float(),
          percentageAmount: faker.datatype.float(),
          createdAt: new Date(),
          expiresAt: faker.date.future(),
        },
      });

      await globalThis.dbConnection.voucher.create({
        data: {
          id: faker.datatype.uuid(),
          active: false,
          code: fakeDeactivedVoucherCode,
          quantity: 10,
          type: VoucherDiscountTypes.ABSOLUTE,
          rawDiscountAmount: faker.datatype.float(),
          percentageAmount: faker.datatype.float(),
          createdAt: new Date(),
          expiresAt: faker.date.future(),
        },
      });

      await globalThis.dbConnection.voucher.create({
        data: {
          id: faker.datatype.uuid(),
          active: true,
          code: fakeExpiredVoucherCode,
          quantity: 10,
          type: VoucherDiscountTypes.ABSOLUTE,
          rawDiscountAmount: faker.datatype.float(),
          percentageAmount: faker.datatype.float(),
          createdAt: new Date(),
          expiresAt: faker.date.past(),
        },
      });
    });

    afterAll(async () => {
      await globalThis.dbConnection.$transaction([
        globalThis.dbConnection.purchaseOrder.deleteMany({}),
        globalThis.dbConnection.voucher.deleteMany({}),
        globalThis.dbConnection.user.deleteMany({}),
      ]);
    });

    it('apply a voucher in the purchase order', async () => {
      expect.assertions(3);

      const data = {
        customerId: fakeCustomerId,
        voucherCode: fakeVoucherCode,
      };

      const response = await globalThis.request
        .post(`/sales/orders/${fakePurchaseOrderId}/vouchers`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(data);

      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual('Voucher aplicado com sucesso.');

      const purchaseOrder = await globalThis.dbConnection.purchaseOrder.findUnique({
        where: { id: fakePurchaseOrderId },
        include: { voucher: true },
      });

      expect(purchaseOrder!.voucher!.code).toEqual(fakeVoucherCode);
    });

    it('returns 422 when draft purchase order is not found', async () => {
      expect.assertions(2);

      const data = {
        customerId: faker.datatype.uuid(),
        voucherCode: fakeVoucherCode,
      };

      const response = await globalThis.request
        .post(`/sales/orders/${fakePurchaseOrderId}/vouchers`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(data);

      expect(response.status).toEqual(422);
      expect(response.body.message).toEqual('Não foi possível utilizar este voucher.');
    });

    it('returns 422 when voucher is not found', async () => {
      expect.assertions(2);

      const data = {
        customerId: fakeCustomerId,
        voucherCode: 1234,
      };

      const response = await globalThis.request
        .post(`/sales/orders/${fakePurchaseOrderId}/vouchers`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(data);

      expect(response.status).toEqual(422);
      expect(response.body.message).toEqual('Não foi possível utilizar este voucher.');
    });

    it('returns 422 when voucher is deactived', async () => {
      expect.assertions(2);

      const data = {
        customerId: fakeCustomerId,
        voucherCode: fakeDeactivedVoucherCode,
      };

      const response = await globalThis.request
        .post(`/sales/orders/${fakePurchaseOrderId}/vouchers`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(data);

      expect(response.status).toEqual(422);
      expect(response.body.message).toEqual('Não foi possível utilizar este voucher.');
    });

    it('returns 422 when voucher is expired', async () => {
      expect.assertions(2);

      const data = {
        customerId: fakeCustomerId,
        voucherCode: fakeExpiredVoucherCode,
      };

      const response = await globalThis.request
        .post(`/sales/orders/${fakePurchaseOrderId}/vouchers`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(data);

      expect(response.status).toEqual(422);
      expect(response.body.message).toEqual('Não foi possível utilizar este voucher.');
    });
  });
});
