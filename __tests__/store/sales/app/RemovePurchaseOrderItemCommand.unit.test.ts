import RemovePurchaseOrderItemCommand from '@sales/app/commands/RemovePurchaseOrderItemCommand';
import ValidationError from '@shared/errors/ValidationError';

describe("RemovePurchaseOrderItemCommand's unit tests", () => {
  it('throws a ValidationError if data is invalid', () => {
    expect.assertions(1);

    expect(() => {
      // eslint-disable-next-line no-new
      new RemovePurchaseOrderItemCommand('wrong');
    }).toThrow(ValidationError);
  });
});
