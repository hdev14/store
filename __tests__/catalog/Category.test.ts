import Category from '../../src/catalog/Category';
import ValidationEntityError from '../../src/shared/errors/ValidationEntityError';

describe("Category's Unit Tests", () => {
  it('doesn\'t throw any error if params are correct', () => {
    expect(() => new Category({ id: 'testid', name: 'test', code: 1 })).not.toThrow(ValidationEntityError);
  });

  it('throws a ValidationEntityError if params are invalid', () => {
    expect(() => new Category({
      id: 'testid',
      name: '',
      code: 1,
    })).toThrow(ValidationEntityError);

    expect(() => new Category({
      id: 'testid',
      name: 'test',
      code: 0,
    })).toThrow(ValidationEntityError);
  });
});
