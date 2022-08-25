import Category from '@catalog/domain/Category';
import ValidationError from '@shared/errors/ValidationError';

describe("Category's Unit Tests", () => {
  it('doesn\'t throw any error if params are correct', () => {
    expect(() => new Category({ id: 'testid', name: 'test', code: 1 })).not.toThrow(ValidationError);
  });

  it('throws a ValidationError if params are invalid', () => {
    expect(() => new Category({
      id: 'testid',
      name: '',
      code: 1,
    })).toThrow(ValidationError);

    expect(() => new Category({
      id: 'testid',
      name: 'test',
      code: 0,
    })).toThrow(ValidationError);
  });
});
