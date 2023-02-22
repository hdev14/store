import StartPurchaseOrderCommand from '@sales/app/commands/StartPurchaseOrderCommand';
import ValidationError from '@shared/errors/ValidationError';

describe("StartPurchaseOrderCommand's unit tests", () => {
  it('throws a ValidationError if data is invalid', async () => {
    expect.assertions(1);

    expect(() => new StartPurchaseOrderCommand('wrong', 123 as any, -1))
      .toThrowError(ValidationError);
  });
});
