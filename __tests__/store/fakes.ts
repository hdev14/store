export const fakeCategories = [
  {
    id: 'test_category_id_1',
    name: 'test_category_1',
    code: 123,
    toObject() {
      return this;
    },
  },
  {
    id: 'test_category_id_2',
    name: 'test_category_2',
    code: 124,
    toObject() {
      return this;
    },
  },
];

export const fakeProducts = [
  {
    id: 'test_product_id_1',
    name: 'test_product_1',
    description: 'test_product_1',
    amount: Math.random() * 100,
    image: 'http://example.com',
    stockQuantity: parseInt((Math.random() * 10).toString(), 10),
    createdAt: new Date(),
    dimensions: {
      height: Math.random() * 50,
      width: Math.random() * 50,
      depth: Math.random() * 50,
    },
    category: fakeCategories[0],
    toObject() {
      return this;
    },
  },
  {
    id: 'test_product_id_2',
    name: 'test_product_2',
    description: 'test_product_2',
    amount: Math.random() * 100,
    image: 'http://example.com',
    stockQuantity: parseInt((Math.random() * 10).toString(), 10),
    createdAt: new Date(),
    dimensions: {
      height: Math.random() * 50,
      width: Math.random() * 50,
      depth: Math.random() * 50,
    },
    category: fakeCategories[0],
    toObject() {
      return this;
    },
  },
  {
    id: 'test_product_id_3',
    name: 'test_product_3',
    description: 'test_product_3',
    amount: Math.random() * 100,
    image: 'http://example.com',
    stockQuantity: parseInt((Math.random() * 10).toString(), 10),
    createdAt: new Date(),
    dimensions: {
      height: Math.random() * 50,
      width: Math.random() * 50,
      depth: Math.random() * 50,
    },
    category: fakeCategories[1],
    toObject() {
      return this;
    },
  },
];
