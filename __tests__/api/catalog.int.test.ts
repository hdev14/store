import { faker } from '@faker-js/faker';

describe('Catalog\'s Integration Tests', () => {
  describe('GET: /catalog/products/:id', () => {
    let category: any;
    let product: any;

    beforeAll(async () => {
      category = await globalThis.dbConnection.category.create({
        data: {
          id: faker.datatype.uuid(),
          code: parseInt(faker.random.numeric(5), 10),
          name: faker.word.adjective(),
        },
      });

      product = await globalThis.dbConnection.product.create({
        data: {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          description: faker.commerce.productDescription(),
          amount: faker.datatype.float(100),
          active: faker.datatype.boolean(),
          depth: faker.datatype.number(50),
          height: faker.datatype.number(50),
          width: faker.datatype.number(50),
          stockQuantity: faker.datatype.number(100),
          image: faker.internet.url(),
          createdAt: new Date(),
          categoryId: category.id,
        },
      });
    });

    afterAll(async () => {
      await globalThis.dbConnection.$transaction([
        globalThis.dbConnection.product.deleteMany({}),
        globalThis.dbConnection.category.deleteMany({}),
      ]);
    });

    it("returns a not found response if product doesn't exist", async () => {
      expect.assertions(2);

      const fakeProductId = 'wrong';
      const response = await globalThis.request
        .get(`/catalog/products/${fakeProductId}`)
        .set('Accept', 'application/json');

      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual('O produto não foi encontrado.');
    });

    it('returns a product if product exists', async () => {
      expect.assertions(4);

      const response = await globalThis.request
        .get(`/catalog/products/${product.id}`)
        .set('Accept', 'application/json');

      expect(response.status).toEqual(200);
      expect(response.body.product.id).toEqual(product.id);
      expect(response.body.product.name).toEqual(product.name);
      expect(response.body.product.category.id).toEqual(category.id);
    });
  });

  describe('GET: /catalog/products', () => {
    beforeAll(async () => {
      const category = await globalThis.dbConnection.category.create({
        data: {
          id: faker.datatype.uuid(),
          code: parseInt(faker.random.numeric(5), 10),
          name: faker.word.adjective(),
        },
      });

      const products = [
        {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          description: faker.commerce.productDescription(),
          amount: faker.datatype.float(100),
          active: faker.datatype.boolean(),
          depth: faker.datatype.number(50),
          height: faker.datatype.number(50),
          width: faker.datatype.number(50),
          stockQuantity: faker.datatype.number(100),
          image: faker.internet.url(),
          createdAt: new Date(),
          categoryId: category.id,
        },
        {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          description: faker.commerce.productDescription(),
          amount: faker.datatype.float(100),
          active: faker.datatype.boolean(),
          depth: faker.datatype.number(50),
          height: faker.datatype.number(50),
          width: faker.datatype.number(50),
          stockQuantity: faker.datatype.number(100),
          image: faker.internet.url(),
          createdAt: new Date(),
          categoryId: category.id,
        },
        {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          description: faker.commerce.productDescription(),
          amount: faker.datatype.float(100),
          active: faker.datatype.boolean(),
          depth: faker.datatype.number(50),
          height: faker.datatype.number(50),
          width: faker.datatype.number(50),
          stockQuantity: faker.datatype.number(100),
          image: faker.internet.url(),
          createdAt: new Date(),
          categoryId: category.id,
        },
      ];

      await globalThis.dbConnection.$transaction(
        products.map((data) => globalThis.dbConnection.product.create({ data })),
      );
    });

    afterAll(async () => {
      await globalThis.dbConnection.$transaction([
        globalThis.dbConnection.product.deleteMany({}),
        globalThis.dbConnection.category.deleteMany({}),
      ]);
    });

    it('returns all products with category data associated', async () => {
      expect.assertions(3);

      const response = await globalThis.request
        .get('/catalog/products')
        .set('Accept', 'application/json');

      expect(response.status).toEqual(200);
      expect(response.body.results).toHaveLength(3);
      expect(response.body.results.every((p: any) => !!p.category.id)).toBe(true);
    });
  });

  describe('GET: /catalog/products/categories/:id', () => {
    const categoryId1 = faker.datatype.uuid();
    const categoryId2 = faker.datatype.uuid();

    beforeAll(async () => {
      const categories = [
        {
          id: categoryId1,
          code: parseInt(faker.random.numeric(5), 10),
          name: faker.word.adjective(),
        },
        {
          id: categoryId2,
          code: parseInt(faker.random.numeric(5), 10),
          name: faker.word.adjective(),
        },
      ];

      const products = [
        {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          description: faker.commerce.productDescription(),
          amount: faker.datatype.float(100),
          active: faker.datatype.boolean(),
          depth: faker.datatype.number(50),
          height: faker.datatype.number(50),
          width: faker.datatype.number(50),
          stockQuantity: faker.datatype.number(100),
          image: faker.internet.url(),
          createdAt: new Date(),
          categoryId: categoryId1,
        },
        {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          description: faker.commerce.productDescription(),
          amount: faker.datatype.float(100),
          active: faker.datatype.boolean(),
          depth: faker.datatype.number(50),
          height: faker.datatype.number(50),
          width: faker.datatype.number(50),
          stockQuantity: faker.datatype.number(100),
          image: faker.internet.url(),
          createdAt: new Date(),
          categoryId: categoryId1,
        },
        {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          description: faker.commerce.productDescription(),
          amount: faker.datatype.float(100),
          active: faker.datatype.boolean(),
          depth: faker.datatype.number(50),
          height: faker.datatype.number(50),
          width: faker.datatype.number(50),
          stockQuantity: faker.datatype.number(100),
          image: faker.internet.url(),
          createdAt: new Date(),
          categoryId: categoryId2,
        },
      ];

      await globalThis.dbConnection.$transaction([
        ...categories.map((data) => globalThis.dbConnection.category.create({ data })),
        ...products.map((data) => globalThis.dbConnection.product.create({ data })),
      ]);
    });

    afterAll(async () => {
      await globalThis.dbConnection.$transaction([
        globalThis.dbConnection.product.deleteMany({}),
        globalThis.dbConnection.category.deleteMany({}),
      ]);
    });

    it('returns any products related to a specific category', async () => {
      expect.assertions(4);

      let response = await globalThis.request
        .get(`/catalog/products/categories/${categoryId1}`)
        .set('Accept', 'application/json');

      expect(response.status).toEqual(200);
      expect(response.body.results).toHaveLength(2);

      response = await globalThis.request
        .get(`/catalog/products/categories/${categoryId2}`)
        .set('Accept', 'application/json');

      expect(response.status).toEqual(200);
      expect(response.body.results).toHaveLength(1);
    });

    it("returns an empty array if category doesn't exist", async () => {
      expect.assertions(2);
      const fakeCategoryId = faker.datatype.uuid();

      const response = await globalThis.request
        .get(`/catalog/products/categories/${fakeCategoryId}`)
        .set('Accept', 'application/json');

      expect(response.status).toEqual(200);
      expect(response.body.results).toHaveLength(0);
    });
  });

  describe('PATCH: /catalog/products/:id/stock', () => {
    const productId = faker.datatype.uuid();
    const stockQuantity = parseInt(faker.datatype.number(100).toString(), 10);

    beforeAll(async () => {
      const category = {
        id: faker.datatype.uuid(),
        code: parseInt(faker.random.numeric(5), 10),
        name: faker.word.adjective(),
      };

      const product = {
        id: productId,
        name: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        amount: faker.datatype.float(100),
        active: faker.datatype.boolean(),
        depth: faker.datatype.number(50),
        height: faker.datatype.number(50),
        width: faker.datatype.number(50),
        stockQuantity,
        image: faker.internet.url(),
        createdAt: new Date(),
        categoryId: category.id,
      };

      await globalThis.dbConnection.$transaction([
        globalThis.dbConnection.category.create({ data: category }),
        globalThis.dbConnection.product.create({ data: product }),
      ]);
    });

    afterAll(async () => {
      await globalThis.dbConnection.$transaction([
        globalThis.dbConnection.product.deleteMany({}),
        globalThis.dbConnection.category.deleteMany({}),
      ]);
    });

    it('removes a quantity of product from stock', async () => {
      expect.assertions(2);

      const qtyToRemove = parseInt((Math.random() * 10).toString(), 10);

      const response = await globalThis.request
        .patch(`/catalog/products/${productId}/stock`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({ quantity: qtyToRemove * -1 });

      const product = await globalThis.dbConnection.product.findUnique({
        where: { id: productId },
      });

      expect(response.status).toEqual(204);
      expect(product!.stockQuantity).toEqual(stockQuantity - qtyToRemove);
    });
  });
});
