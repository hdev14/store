import { faker } from '@faker-js/faker';
import Mongo from '@mongo/index';
import { CategoryModel, ProductModel, UserModel } from '@mongo/models';
import { PurchaseOrderStatus } from '@sales/domain/PurchaseOrder';

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
});
