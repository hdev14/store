import { faker } from '@faker-js/faker';
import { PurchaseOrderStatus } from '@sales/domain/PurchaseOrder';
import { VoucherDiscountTypes } from '@sales/domain/Voucher';
import createFakeAuthToken from '@tests/utils/createFakeAuthToken';

describe('Sales Integration Tests', () => {
  let fakeToken: string;

  beforeAll(() => {
    fakeToken = createFakeAuthToken();
  });

  describe('POST: /sales/orders/items', () => {
    let product: any;
    let user: any;

    beforeAll(async () => {
      user = await globalThis.dbConnection.user.create({
        data: {
          id: faker.datatype.uuid(),
          name: faker.name.fullName(),
        },
      });

      const categoryData = {
        id: faker.datatype.uuid(),
        name: faker.word.verb(),
        code: parseInt(faker.random.numeric(5), 10),
      };

      const category = await globalThis.dbConnection.category.create({
        data: categoryData,
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
    });

    afterAll(async () => {
      await globalThis.dbConnection.$transaction([
        globalThis.dbConnection.purchaseOrderItem.deleteMany({}),
        globalThis.dbConnection.purchaseOrder.deleteMany({}),
        globalThis.dbConnection.product.deleteMany({}),
        globalThis.dbConnection.category.deleteMany({}),
        globalThis.dbConnection.user.deleteMany({}),
      ]);
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
        .auth(fakeToken, { type: 'bearer' })
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
        .auth(fakeToken, { type: 'bearer' })
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
        .auth(fakeToken, { type: 'bearer' })
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
        .auth(fakeToken, { type: 'bearer' })
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
        .auth(fakeToken, { type: 'bearer' })
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

    it('applies a voucher in the purchase order', async () => {
      expect.assertions(3);

      const data = {
        customerId: fakeCustomerId,
        voucherCode: fakeVoucherCode,
      };

      const response = await globalThis.request
        .post(`/sales/orders/${fakePurchaseOrderId}/vouchers`)
        .auth(fakeToken, { type: 'bearer' })
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

    it("returns 404 if purchase order doesn't exist", async () => {
      expect.assertions(2);

      const data = {
        customerId: faker.datatype.uuid(),
        voucherCode: fakeVoucherCode,
      };

      const response = await globalThis.request
        .post(`/sales/orders/${fakePurchaseOrderId}/vouchers`)
        .auth(fakeToken, { type: 'bearer' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(data);

      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual('Pedido não encontrado.');
    });

    it("returns 404 if voucher doesn't exist", async () => {
      expect.assertions(2);

      const data = {
        customerId: fakeCustomerId,
        voucherCode: 1234,
      };

      const response = await globalThis.request
        .post(`/sales/orders/${fakePurchaseOrderId}/vouchers`)
        .auth(fakeToken, { type: 'bearer' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(data);

      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual('Voucher não encontrado.');
    });

    it('returns 422 when voucher is deactived', async () => {
      expect.assertions(2);

      const data = {
        customerId: fakeCustomerId,
        voucherCode: fakeDeactivedVoucherCode,
      };

      const response = await globalThis.request
        .post(`/sales/orders/${fakePurchaseOrderId}/vouchers`)
        .auth(fakeToken, { type: 'bearer' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(data);

      expect(response.status).toEqual(422);
      expect(response.body.message).toEqual('Este voucher não é válido.');
    });

    it('returns 422 when voucher is expired', async () => {
      expect.assertions(2);

      const data = {
        customerId: fakeCustomerId,
        voucherCode: fakeExpiredVoucherCode,
      };

      const response = await globalThis.request
        .post(`/sales/orders/${fakePurchaseOrderId}/vouchers`)
        .auth(fakeToken, { type: 'bearer' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(data);

      expect(response.status).toEqual(422);
      expect(response.body.message).toEqual('Este voucher não é válido.');
    });

    it('returns 400 if data is invalid', async () => {
      expect.assertions(2);

      const data = {
        customerId: 'wrong',
        voucherCode: 'wrong',
      };

      const response = await globalThis.request
        .post(`/sales/orders/${fakePurchaseOrderId}/vouchers`)
        .auth(fakeToken, { type: 'bearer' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(data);

      expect(response.status).toEqual(400);
      expect(response.body.errors).toHaveLength(2);
    });
  });

  describe('GET: /sales/orders/:id', () => {
    const fakePurchaseOrderId = faker.datatype.uuid();

    beforeAll(async () => {
      const user = await globalThis.dbConnection.user.create({
        data: {
          id: faker.datatype.uuid(),
          name: faker.name.fullName(),
        },
      });

      await globalThis.dbConnection.purchaseOrder.create({
        data: {
          id: fakePurchaseOrderId,
          code: faker.datatype.number(),
          customerId: user.id,
          status: PurchaseOrderStatus.STARTED,
          createdAt: new Date(),
          discountAmount: 0,
          totalAmount: 0,
        },
      });
    });

    afterAll(async () => {
      await globalThis.dbConnection.$transaction([
        globalThis.dbConnection.purchaseOrder.deleteMany(),
        globalThis.dbConnection.user.deleteMany(),
      ]);
    });

    it('returns a purchase order by id', async () => {
      expect.assertions(2);

      const response = await globalThis.request
        .get(`/sales/orders/${fakePurchaseOrderId}`)
        .auth(fakeToken, { type: 'bearer' })
        .set('Accept', 'application/json')
        .send();

      expect(response.status).toEqual(200);
      expect(response.body.id).toBe(fakePurchaseOrderId);
    });

    it("returns 404 if purchase order doesn't exist", async () => {
      expect.assertions(2);

      const nonexistPurchaseOrderId = faker.datatype.uuid();

      const response = await globalThis.request
        .get(`/sales/orders/${nonexistPurchaseOrderId}`)
        .auth(fakeToken, { type: 'bearer' })
        .set('Accept', 'application/json')
        .send();

      expect(response.status).toEqual(404);
      expect(response.body.message).toBe('Pedido não encontrado.');
    });
  });

  describe('GET: /sales/customers/:id/orders', () => {
    const fakeCustomerId1 = faker.datatype.uuid();
    const fakeCustomerId2 = faker.datatype.uuid();

    beforeAll(async () => {
      await globalThis.dbConnection.user.create({
        data: {
          id: fakeCustomerId1,
          name: faker.name.fullName(),
        },
      });

      await globalThis.dbConnection.user.create({
        data: {
          id: fakeCustomerId2,
          name: faker.name.fullName(),
        },
      });

      await globalThis.dbConnection.purchaseOrder.create({
        data: {
          id: faker.datatype.uuid(),
          code: faker.datatype.number(),
          customerId: fakeCustomerId1,
          status: PurchaseOrderStatus.STARTED,
          createdAt: new Date(),
          discountAmount: 0,
          totalAmount: 0,
        },
      });

      await globalThis.dbConnection.purchaseOrder.create({
        data: {
          id: faker.datatype.uuid(),
          code: faker.datatype.number(),
          customerId: fakeCustomerId1,
          status: PurchaseOrderStatus.STARTED,
          createdAt: new Date(),
          discountAmount: 0,
          totalAmount: 0,
        },
      });

      await globalThis.dbConnection.purchaseOrder.create({
        data: {
          id: faker.datatype.uuid(),
          code: faker.datatype.number(),
          customerId: fakeCustomerId2,
          status: PurchaseOrderStatus.STARTED,
          createdAt: new Date(),
          discountAmount: 0,
          totalAmount: 0,
        },
      });
    });

    afterAll(async () => {
      await globalThis.dbConnection.$transaction([
        globalThis.dbConnection.purchaseOrder.deleteMany(),
        globalThis.dbConnection.user.deleteMany(),
      ]);
    });

    it('returns an array of purchase order by customerId', async () => {
      expect.assertions(2);

      const response = await globalThis.request
        .get(`/sales/customers/${fakeCustomerId1}/orders`)
        .auth(fakeToken, { type: 'bearer' })
        .set('Accept', 'application/json')
        .send();

      expect(response.status).toEqual(200);
      expect(response.body.results).toHaveLength(2);
    });

    it("returns an empty array if the customer doesn't have any purchase order", async () => {
      expect.assertions(2);

      const response = await globalThis.request
        .get(`/sales/customers/${faker.datatype.uuid()}/orders`)
        .auth(fakeToken, { type: 'bearer' })
        .set('Accept', 'application/json')
        .send();

      expect(response.status).toEqual(200);
      expect(response.body.results).toHaveLength(0);
    });
  });

  describe('GET: /sales/orders/items/:id', () => {
    const fakePurchaseOrderItemId = faker.datatype.uuid();

    beforeAll(async () => {
      const category = await globalThis.dbConnection.category.create({
        data: {
          id: faker.datatype.uuid(),
          code: parseInt(faker.datatype.number().toString(), 10),
          name: faker.word.adjective(),
        },
      });

      const product = await globalThis.dbConnection.product.create({
        data: {
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
        },
      });

      const user = await globalThis.dbConnection.user.create({
        data: {
          id: faker.datatype.uuid(),
          name: faker.name.fullName(),
        },
      });

      const purchaseOrder = await globalThis.dbConnection.purchaseOrder.create({
        data: {
          id: faker.datatype.uuid(),
          code: parseInt(faker.datatype.number().toString(), 10),
          totalAmount: faker.datatype.float(),
          discountAmount: faker.datatype.float(),
          status: PurchaseOrderStatus.DRAFT,
          customerId: user.id,
          createdAt: new Date(),
        },
      });

      await globalThis.dbConnection.purchaseOrderItem.create({
        data: {
          id: fakePurchaseOrderItemId,
          productId: product.id,
          purchaseOrderId: purchaseOrder.id,
          quantity: 1,
        },
      });
    });

    afterAll(async () => {
      await globalThis.dbConnection.$transaction([
        globalThis.dbConnection.purchaseOrderItem.deleteMany(),
        globalThis.dbConnection.purchaseOrder.deleteMany(),
        globalThis.dbConnection.user.deleteMany(),
        globalThis.dbConnection.product.deleteMany(),
        globalThis.dbConnection.category.deleteMany(),
      ]);
    });

    it('returns a purchase order item by id', async () => {
      expect.assertions(2);

      const response = await globalThis.request
        .get(`/sales/orders/items/${fakePurchaseOrderItemId}`)
        .auth(fakeToken, { type: 'bearer' })
        .set('Accept', 'application/json')
        .send();

      expect(response.status).toEqual(200);
      expect(response.body.id).toBe(fakePurchaseOrderItemId);
    });

    it("returns 404 if purchase order item doesn't exist", async () => {
      expect.assertions(2);

      const nonexistPurchaseOrderId = faker.datatype.uuid();

      const response = await globalThis.request
        .get(`/sales/orders/items/${nonexistPurchaseOrderId}`)
        .auth(fakeToken, { type: 'bearer' })
        .set('Accept', 'application/json')
        .send();

      expect(response.status).toEqual(404);
      expect(response.body.message).toBe('Item não encontrado.');
    });
  });

  describe('GET: /sales/vouchers/:code', () => {
    const fakeVoucherCode = parseInt(faker.datatype.number().toString(), 10);

    beforeAll(async () => {
      await globalThis.dbConnection.voucher.create({
        data: {
          id: faker.datatype.uuid(),
          percentageAmount: faker.datatype.float(),
          rawDiscountAmount: faker.datatype.float(),
          quantity: parseInt(faker.datatype.number().toString(), 10),
          type: VoucherDiscountTypes.ABSOLUTE,
          createdAt: new Date(),
          expiresAt: new Date(),
          usedAt: new Date(),
          active: false,
          code: fakeVoucherCode,
        },
      });
    });

    afterAll(async () => {
      await globalThis.dbConnection.voucher.deleteMany();
    });

    it('returns a voucher by code', async () => {
      expect.assertions(2);

      const response = await globalThis.request
        .get(`/sales/vouchers/${fakeVoucherCode}`)
        .auth(fakeToken, { type: 'bearer' })
        .set('Accept', 'application/json')
        .send();

      expect(response.status).toEqual(200);
      expect(response.body.code).toBe(fakeVoucherCode);
    });

    it("returns 404 if voucher doesn't exist", async () => {
      expect.assertions(2);

      const nonexistentVoucherCode = parseInt(faker.datatype.number().toString(), 10);

      const response = await globalThis.request
        .get(`/sales/vouchers/${nonexistentVoucherCode}`)
        .auth(fakeToken, { type: 'bearer' })
        .set('Accept', 'application/json')
        .send();

      expect(response.status).toEqual(404);
      expect(response.body.message).toBe('Voucher não encontrado.');
    });
  });

  describe('PATCH: /sales/orders/items/:id/quantities', () => {
    const fakePurchaseOrderItemId = faker.datatype.uuid();

    beforeAll(async () => {
      const categoryData = {
        id: faker.datatype.uuid(),
        name: faker.word.verb(),
        code: parseInt(faker.random.numeric(5), 10),
      };

      const category = await globalThis.dbConnection.category.create({
        data: categoryData,
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

      const product = await globalThis.dbConnection.product.create({
        data: productData,
      });

      const user = await globalThis.dbConnection.user.create({
        data: {
          id: faker.datatype.uuid(),
          name: faker.name.fullName(),
        },
      });

      const purchaseOrder = await globalThis.dbConnection.purchaseOrder.create({
        data: {
          id: faker.datatype.uuid(),
          code: parseInt(faker.datatype.number().toString(), 10),
          totalAmount: faker.datatype.float(),
          discountAmount: faker.datatype.float(),
          status: PurchaseOrderStatus.DRAFT,
          customerId: user.id,
          createdAt: new Date(),
        },
      });

      const purchaseOrderItemData = {
        purchaseOrderId: purchaseOrder.id,
        quantity: 1,
        productId: product.id,
      };

      await globalThis.dbConnection.purchaseOrderItem.create({
        data: {
          ...purchaseOrderItemData,
          id: fakePurchaseOrderItemId,
        },
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
    });

    it('updates purchase order item quantity', async () => {
      expect.assertions(2);

      const quantity = parseInt(faker.datatype.number().toString(), 10);

      const response = await globalThis.request
        .patch(`/sales/orders/items/${fakePurchaseOrderItemId}/quantities`)
        .auth(fakeToken, { type: 'bearer' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({ quantity });

      expect(response.status).toEqual(204);
      const purchaseOrderItem = await globalThis.dbConnection.purchaseOrderItem.findFirst({
        where: { id: fakePurchaseOrderItemId },
      });

      expect(purchaseOrderItem!.quantity).toBe(quantity);
    });

    it("returns 404 if purchase order item doesn't exist", async () => {
      expect.assertions(2);

      const nonexsitentPurchaseOrderItemId = faker.datatype.uuid();
      const quantity = parseInt(faker.datatype.number().toString(), 10);

      const response = await globalThis.request
        .patch(`/sales/orders/items/${nonexsitentPurchaseOrderItemId}/quantities`)
        .auth(fakeToken, { type: 'bearer' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({ quantity });

      expect(response.status).toEqual(404);
      expect(response.body.message).toBe('Item não encontrado.');
    });
  });
});
