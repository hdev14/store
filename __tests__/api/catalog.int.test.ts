import { faker } from '@faker-js/faker';

describe('Catalog\'s Integration Tests', () => {
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
      globalThis.dbConnection.product.deleteMany(),
      globalThis.dbConnection.category.deleteMany(),
    ]);
  });

  describe('/catalog/products/:id', () => {
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
});
