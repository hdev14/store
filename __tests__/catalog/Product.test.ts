import Category from '../../src/catalog/Category';
import Dimensions from '../../src/catalog/Dimensions';
import Product from '../../src/catalog/Product';
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
});
