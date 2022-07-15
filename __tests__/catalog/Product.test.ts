import Category from '../../src/catalog/domain/Category';
import Dimensions from '../../src/catalog/domain/Dimensions';
import Product from '../../src/catalog/domain/Product';
import ValidationEntityError from '../../src/shared/errors/ValidationEntityError';

describe("Product's Unit Tests", () => {
  it('doesn\'t throw a ValidationEntityError if params are correct', () => {
    const dimensions = new Dimensions({ height: 1, width: 1, depth: 1 });
    const category = new Category({ id: 'testid', name: 'test', code: 1 });

    expect(() => new Product({
      id: 'testid',
      name: 'test',
      description: 'test',
      amount: Math.random() * 100,
      category,
      dimensions,
      createdAt: new Date(),
      image: 'http://example.com/test',
      stockQuantity: 10,
    })).not.toThrow(ValidationEntityError);
  });

  it('throws a ValidationEntityError if params are invalid', () => {
    const dimensions = new Dimensions({ height: 1, width: 1, depth: 1 });
    const category = new Category({ id: 'testid', name: 'test', code: 1 });

    expect(() => new Product({
      id: 'testid',
      name: '',
      description: 'test',
      amount: Math.random() * 100,
      createdAt: new Date(),
      dimensions,
      image: 'http://example.com/test',
      stockQuantity: 10,
      category,
    })).toThrow(ValidationEntityError);

    expect(() => new Product({
      id: 'testid',
      name: 'test',
      description: '',
      amount: Math.random() * 100,
      createdAt: new Date(),
      dimensions,
      image: 'http://example.com/test',
      stockQuantity: 10,
      category,
    })).toThrow(ValidationEntityError);

    expect(() => new Product({
      id: 'testid',
      name: 'test',
      description: 'test',
      amount: Math.random() * 100,
      createdAt: new Date(),
      dimensions,
      image: 'http://example.com/test',
      stockQuantity: 10,
      category: {} as Category,
    })).toThrow(ValidationEntityError);

    expect(() => new Product({
      id: 'testid',
      name: 'test',
      description: 'test',
      amount: Math.random() * 100,
      createdAt: new Date(),
      dimensions,
      image: 'invalid',
      stockQuantity: 10,
      category,
    })).toThrow(ValidationEntityError);
  });

  it('actives the product', () => {
    const product = new Product({
      id: 'testid',
      name: 'test',
      description: 'test',
      amount: Math.random() * 100,
      category: new Category({ id: 'testid', name: 'test', code: 1 }),
      dimensions: new Dimensions({ height: 1, width: 1, depth: 1 }),
      createdAt: new Date(),
      image: 'http://example.com/test',
      stockQuantity: 10,
    });

    product.activeProduct();

    expect(product.active).toBe(true);
  });

  it('deactives the product', () => {
    const product = new Product({
      id: 'testid',
      name: 'test',
      description: 'test',
      amount: Math.random() * 100,
      category: new Category({ id: 'testid', name: 'test', code: 1 }),
      dimensions: new Dimensions({ height: 1, width: 1, depth: 1 }),
      createdAt: new Date(),
      image: 'http://example.com/test',
      stockQuantity: 10,
    });

    product.deactiveProduct();

    expect(product.active).toBe(false);
  });

  it('changes the product\'s category', () => {
    const product = new Product({
      id: 'testid',
      name: 'test',
      description: 'test',
      amount: Math.random() * 100,
      category: new Category({ id: 'categoryid1', name: 'test', code: 1 }),
      dimensions: new Dimensions({ height: 1, width: 1, depth: 1 }),
      createdAt: new Date(),
      image: 'http://example.com/test',
      stockQuantity: 10,
    });

    product.changeCategory(new Category({ id: 'categoryid2', name: 'test', code: 2 }));

    expect(product.category.id).toBe('categoryid2');
  });

  it('removes product\'s quantity from stock ', () => {
    const product = new Product({
      id: 'testid',
      name: 'test',
      description: 'test',
      amount: Math.random() * 100,
      category: new Category({ id: 'testid', name: 'test', code: 1 }),
      dimensions: new Dimensions({ height: 1, width: 1, depth: 1 }),
      createdAt: new Date(),
      image: 'http://example.com/test',
      stockQuantity: 10,
    });

    product.removeFromStock(2);

    expect(product.stockQuantity).toBe(8);
  });

  it('adds product\'s quantity to stock ', () => {
    const product = new Product({
      id: 'testid',
      name: 'test',
      description: 'test',
      amount: Math.random() * 100,
      category: new Category({ id: 'testid', name: 'test', code: 1 }),
      dimensions: new Dimensions({ height: 1, width: 1, depth: 1 }),
      createdAt: new Date(),
      image: 'http://example.com/test',
      stockQuantity: 10,
    });

    product.addToStock(2);

    expect(product.stockQuantity).toBe(12);
  });

  it('checks if has stock for a specific quantity', () => {
    const product = new Product({
      id: 'testid',
      name: 'test',
      description: 'test',
      amount: Math.random() * 100,
      category: new Category({ id: 'testid', name: 'test', code: 1 }),
      dimensions: new Dimensions({ height: 1, width: 1, depth: 1 }),
      createdAt: new Date(),
      image: 'http://example.com/test',
      stockQuantity: 10,
    });

    expect(product.hasStockFor(10)).toBe(true);
    expect(product.hasStockFor(11)).toBe(false);
  });
});
