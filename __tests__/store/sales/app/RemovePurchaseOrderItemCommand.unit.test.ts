import RemovePurchaseOrderItemCommand from '@sales/app/commands/RemovePurchaseOrderItemCommand';
import ValidationError from '@shared/errors/ValidationError';

describe("RemovePurchaseOrderItemCommand's unit tests", () => {
  it('throws a ValidationError if data is invalid', async () => {
    expect.assertions(1);

    expect(() => new RemovePurchaseOrderItemCommand('wrong'))
      .toThrowError(ValidationError);
  });
});
