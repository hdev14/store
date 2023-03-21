import Category from '@catalog/domain/Category';
import Product from '@catalog/domain/Product';
import ValidationError from '@shared/errors/ValidationError';

describe("Product's Unit Tests", () => {
  it('doesn\'t throw a ValidationError if params are correct', () => {
    const dimensions = { height: 1, width: 1, depth: 1 };
    const category = { id: 'testid', name: 'test', code: 1 };

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
    })).not.toThrow(ValidationError);
  });

  it('throws a ValidationError if params are invalid', () => {
    const dimensions = { height: 1, width: 1, depth: 1 };
    const category = { id: 'testid', name: 'test', code: 1 };

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
    })).toThrow(ValidationError);

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
    })).toThrow(ValidationError);

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
    })).toThrow(ValidationError);

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
    })).toThrow(ValidationError);
  });

  it('actives the product', () => {
    const product = new Product({
      id: 'testid',
      name: 'test',
      description: 'test',
      amount: Math.random() * 100,
      category: { id: 'testid', name: 'test', code: 1 },
      dimensions: { height: 1, width: 1, depth: 1 },
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
      category: { id: 'testid', name: 'test', code: 1 },
      dimensions: { height: 1, width: 1, depth: 1 },
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
      category: { id: 'categoryid1', name: 'test', code: 1 },
      dimensions: { height: 1, width: 1, depth: 1 },
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
      category: { id: 'testid', name: 'test', code: 1 },
      dimensions: { height: 1, width: 1, depth: 1 },
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
      category: { id: 'testid', name: 'test', code: 1 },
      dimensions: { height: 1, width: 1, depth: 1 },
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
      category: { id: 'testid', name: 'test', code: 1 },
      dimensions: { height: 1, width: 1, depth: 1 },
      createdAt: new Date(),
      image: 'http://example.com/test',
      stockQuantity: 10,
    });

    expect(product.hasStockFor(10)).toBe(true);
    expect(product.hasStockFor(11)).toBe(false);
  });
});
