import UpdatePurchaseOrderItemQuantityCommand from '@sales/app/commands/UpdatePurchaseOrderItemQuantityCommand';
import ValidationError from '@shared/errors/ValidationError';

describe("UpdatePurchaseOrderItemQuantityCommand's unit tests", () => {
  it('throws an exception of type ValidationError if data is invalid', async () => {
    expect.assertions(1);

    expect(() => new UpdatePurchaseOrderItemQuantityCommand('wrong', 7.3))
      .toThrowError(ValidationError);
  });
});
