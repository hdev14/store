import { faker } from '@faker-js/faker';
import { Product } from '@prisma/client';

describe("Catalog's Integration Tests", () => {
  describe('GET: /catalog/products/:id', () => {
    let category: any;
    let product: any;

    beforeAll(async () => {
      category = await globalThis.dbConnection.category.create({
        data: {
          id: faker.datatype.uuid(),
          code: parseInt(faker.random.numeric(5), 10),
          name: faker.word.verb(),
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
      expect(response.body.id).toEqual(product.id);
      expect(response.body.name).toEqual(product.name);
      expect(response.body.category.id).toEqual(category.id);
    });
  });

  describe('GET: /catalog/products', () => {
    beforeAll(async () => {
      const category = await globalThis.dbConnection.category.create({
        data: {
          id: faker.datatype.uuid(),
          code: parseInt(faker.random.numeric(5), 10),
          name: faker.word.verb(),
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
          name: faker.word.verb(),
        },
        {
          id: categoryId2,
          code: parseInt(faker.random.numeric(5), 10),
          name: faker.word.verb(),
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
    const products: Array<Product> = [];

    beforeAll(async () => {
      const category = await globalThis.dbConnection.category.create({
        data: {
          id: faker.datatype.uuid(),
          code: parseInt(faker.random.numeric(5), 10),
          name: faker.word.verb(),
        },
      });

      products.push(
        await globalThis.dbConnection.product.create({
          data: {
            id: faker.datatype.uuid(),
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
            categoryId: category.id,
          },
        }),
      );

      products.push(
        await globalThis.dbConnection.product.create({
          data: {
            id: faker.datatype.uuid(),
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
            categoryId: category.id,
          },
        }),
      );

      products.push(
        await globalThis.dbConnection.product.create({
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
        }),
      );
    });

    afterAll(async () => {
      await globalThis.dbConnection.$transaction([
        globalThis.dbConnection.product.deleteMany({}),
        globalThis.dbConnection.category.deleteMany({}),
      ]);
    });

    it('removes a quantity of products from stock', async () => {
      expect.assertions(2);

      const qtyToRemove = parseInt((Math.random() * 10).toString(), 10);

      const productWithStock = products.find((p) => p.stockQuantity > 0);

      const response = await globalThis.request
        .patch(`/catalog/products/${productWithStock!.id}/stock`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({ quantity: qtyToRemove * -1 });

      const product = await globalThis.dbConnection.product.findUnique({
        where: { id: productWithStock!.id },
      });

      expect(response.status).toEqual(204);
      expect(product!.stockQuantity).toEqual(productWithStock!.stockQuantity - qtyToRemove);
    });

    it('adds a quantity of products to stock', async () => {
      expect.assertions(2);

      const qtyToAdd = parseInt((Math.random() * 10).toString(), 10);

      const response = await globalThis.request
        .patch(`/catalog/products/${products[1].id}/stock`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({ quantity: qtyToAdd });

      const product = await globalThis.dbConnection.product.findUnique({
        where: { id: products[1].id },
      });

      expect(response.status).toEqual(204);
      expect(product!.stockQuantity).toEqual(products[1].stockQuantity + qtyToAdd);
    });

    it("returns 422 if product doesn't have stock enough", async () => {
      expect.assertions(2);

      const qtyToRemove = faker.datatype.number({ min: 10 });

      const productWithZeroStock = products.find((p) => p.stockQuantity === 0);

      const response = await globalThis.request
        .patch(`/catalog/products/${productWithZeroStock!.id}/stock`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({ quantity: qtyToRemove * -1 });

      expect(response.status).toEqual(422);
      expect(response.body.message).toEqual('Não foi possível atualizar o estoque do produto.');
    });

    it("returns 422 if product doesn't exists", async () => {
      expect.assertions(2);

      const qtyToRemove = parseInt((Math.random() * 10).toString(), 10);
      const fakeProductId = faker.datatype.uuid();

      const response = await globalThis.request
        .patch(`/catalog/products/${fakeProductId}/stock`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({ quantity: qtyToRemove * -1 });

      expect(response.status).toEqual(422);
      expect(response.body.message).toEqual('Não foi possível atualizar o estoque do produto.');
    });
  });

  describe('GET: /catalogs/categories', () => {
    beforeAll(async () => {
      const categories = [1, 2, 3].map((n) => ({
        id: faker.datatype.uuid(),
        code: parseInt(faker.random.numeric(5), 10),
        name: faker.word.verb() + n,
      }));

      await globalThis.dbConnection.$transaction(
        categories.map((data) => globalThis.dbConnection.category.create({ data })),
      );
    });

    afterAll(async () => {
      await globalThis.dbConnection.category.deleteMany({});
    });

    it('returns all categories', async () => {
      expect.assertions(2);

      const response = await globalThis.request
        .get('/catalog/categories')
        .set('Accept', 'application/json');

      expect(response.status).toEqual(200);
      expect(response.body.results).toHaveLength(3);
    });
  });

  describe('POST: /catalog/products', () => {
    const categoryId = faker.datatype.uuid();

    beforeAll(async () => {
      await globalThis.dbConnection.category.create({
        data: {
          id: categoryId,
          name: faker.word.verb(),
          code: parseInt(faker.random.numeric(5), 10),
        },
      });
    });

    afterAll(async () => {
      await globalThis.dbConnection.product.deleteMany({});
      await globalThis.dbConnection.category.deleteMany({});
    });

    it('creates a new product', async () => {
      expect.assertions(4);

      const data = {
        name: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        amount: faker.datatype.float(100),
        depth: faker.datatype.number(50),
        height: faker.datatype.number(50),
        width: faker.datatype.number(50),
        stockQuantity: parseInt(faker.datatype.number(100).toString(), 10),
        image: faker.internet.url(),
        categoryId,
      };

      const response = await globalThis.request
        .post('/catalog/products')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(data);

      expect(response.status).toEqual(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.name).toEqual(data.name);
      expect(response.body.category.id).toEqual(categoryId);
    });

    it("returns 400 if category doesn't exist", async () => {
      expect.assertions(2);

      const fakeCategoryId = faker.datatype.uuid();

      const data = {
        name: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        amount: faker.datatype.float(100),
        depth: faker.datatype.number(50),
        height: faker.datatype.number(50),
        width: faker.datatype.number(50),
        stockQuantity: parseInt(faker.datatype.number(100).toString(), 10),
        image: faker.internet.url(),
        categoryId: fakeCategoryId,
      };

      const response = await globalThis.request
        .post('/catalog/products')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(data);

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('A categoria não foi encontrada.');
    });

    it('returns 400 if data is invalid', async () => {
      expect.assertions(10);

      const invalidData = {
        name: '', // required
        description: '', // required
        amount: 'abc', // number
        depth: 'abc', // number
        height: 'abc', // number
        width: 'abc', // number
        stockQuantity: 'abc', // number
        image: 'wrong_url',
        categoryId,
      };

      const response = await globalThis.request
        .post('/catalog/products')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(invalidData);

      expect(response.status).toEqual(400);
      expect(response.body.errors).toHaveLength(8);

      const allFields = response.body.errors.map((e: any) => e.field);

      expect(allFields.includes('name')).toBe(true);
      expect(allFields.includes('description')).toBe(true);
      expect(allFields.includes('amount')).toBe(true);
      expect(allFields.includes('depth')).toBe(true);
      expect(allFields.includes('height')).toBe(true);
      expect(allFields.includes('width')).toBe(true);
      expect(allFields.includes('stockQuantity')).toBe(true);
      expect(allFields.includes('image')).toBe(true);
    });
  });

  describe('PUT: /catalog/products/:id', () => {
    const categoryId = faker.datatype.uuid();
    const productId = faker.datatype.uuid();

    beforeAll(async () => {
      await globalThis.dbConnection.$transaction([
        globalThis.dbConnection.category.create({
          data: {
            id: categoryId,
            name: faker.word.verb(),
            code: parseInt(faker.random.numeric(5), 10),
          },
        }),
        globalThis.dbConnection.product.create({
          data: {
            id: productId,
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
            categoryId,
          },
        }),
      ]);
    });

    afterAll(async () => {
      await globalThis.dbConnection.product.deleteMany({});
      await globalThis.dbConnection.category.deleteMany({});
    });

    it("returns 404 if product doesn't exist", async () => {
      expect.assertions(2);

      const fakeProductId = faker.datatype.uuid();

      const data = {
        name: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        amount: faker.datatype.float(100),
        depth: faker.datatype.number(50),
        height: faker.datatype.number(50),
        width: faker.datatype.number(50),
        stockQuantity: parseInt(faker.datatype.number(100).toString(), 10),
        image: faker.internet.url(),
        categoryId,
      };

      const response = await globalThis.request
        .put(`/catalog/products/${fakeProductId}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(data);

      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual('O produto não foi encontrado.');
    });

    it('updates a product', async () => {
      expect.assertions(7);

      const data = {
        name: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        amount: faker.datatype.float(100),
        dimensions: {
          depth: faker.datatype.number(50),
          height: faker.datatype.number(50),
          width: faker.datatype.number(50),
        },
        stockQuantity: parseInt(faker.datatype.number(100).toString(), 10),
        image: faker.internet.url(),
      };

      const response = await globalThis.request
        .put(`/catalog/products/${productId}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(data);

      expect(response.status).toEqual(200);
      expect(response.body.name).toEqual(data.name);
      expect(response.body.description).toEqual(data.description);
      expect(response.body.amount).toEqual(data.amount);
      expect(response.body.stockQuantity).toEqual(data.stockQuantity);
      expect(response.body.image).toEqual(data.image);
      expect(response.body.dimensions).toEqual(data.dimensions);
    });
  });

  describe('POST: /catalog/categories', () => {
    const categoryId = faker.datatype.uuid();

    beforeAll(async () => {
      await globalThis.dbConnection.category.create({
        data: {
          id: categoryId,
          name: faker.word.verb(),
          code: parseInt(faker.random.numeric(5), 10),
        },
      });
    });

    afterAll(async () => {
      await globalThis.dbConnection.category.deleteMany({});
    });

    it('creates a new category', async () => {
      expect.assertions(4);

      const data = {
        name: faker.word.verb(),
      };

      const response = await globalThis.request
        .post('/catalog/categories')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(data);

      expect(response.status).toEqual(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.code).toBeTruthy();
      expect(response.body.name).toEqual(data.name);
    });

    it('returns 400 if data is invalid', async () => {
      expect.assertions(3);

      const invalidData = {
        name: '', // required
      };

      const response = await globalThis.request
        .post('/catalog/categories')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(invalidData);

      expect(response.status).toEqual(400);
      expect(response.body.errors).toHaveLength(1);

      const allFields = response.body.errors.map((e: any) => e.field);
      expect(allFields.includes('name')).toBe(true);
    });
  });

  describe('PUT: /catalog/categories/:id', () => {
    const categoryId = faker.datatype.uuid();

    beforeAll(async () => {
      await globalThis.dbConnection.category.create({
        data: {
          id: categoryId,
          name: faker.word.verb(),
          code: parseInt(faker.random.numeric(5), 10),
        },
      });
    });

    afterAll(async () => {
      await globalThis.dbConnection.category.deleteMany({});
    });

    it("returns 404 if category doesn't exist", async () => {
      expect.assertions(2);

      const fakeCategoryId = faker.datatype.uuid();

      const data = {
        name: faker.word.verb(),
      };

      const response = await globalThis.request
        .put(`/catalog/categories/${fakeCategoryId}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(data);

      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual('A categoria não foi encontrada.');
    });

    it('returns 400 if data are invalid', async () => {
      expect.assertions(3);

      const invalidData = {
        name: 123, // number
      };

      const response = await globalThis.request
        .put(`/catalog/categories/${categoryId}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(invalidData);

      expect(response.status).toEqual(400);
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].field).toEqual('name');
    });

    it('updates a category', async () => {
      expect.assertions(3);

      const data = {
        name: faker.word.verb(),
      };

      const response = await globalThis.request
        .put(`/catalog/categories/${categoryId}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(data);

      const category = await globalThis.dbConnection.category.findUnique({
        where: { id: categoryId },
      });

      expect(response.status).toEqual(200);
      expect(response.body.name).toEqual(data.name);
      expect(category!.name).toEqual(data.name);
    });
  });
});
