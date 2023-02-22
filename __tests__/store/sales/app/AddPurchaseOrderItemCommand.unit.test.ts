import AddPurchaseOrderItemCommand from '@sales/app/commands/AddPurchaseOrderItemCommand';
import ValidationError from '@shared/errors/ValidationError';

describe("AddPurchaseOrderItemCommand's unit tests", () => {
  it('throws an exception of type ValidationError if command data is invalid', async () => {
    expect.assertions(1);

    expect(() => new AddPurchaseOrderItemCommand(
      'wrong',
      'wrong',
      'wrong',
      'wrong' as any,
      123,
    )).toThrowError(ValidationError);
  });
});
