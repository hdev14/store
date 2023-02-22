import ApplyVoucherCommand from '@sales/app/commands/ApplyVoucherCommand';
import ValidationError from '@shared/errors/ValidationError';

describe("ApplyVoucherCommand's unit tests", () => {
  it('throws a ValidationError if data is invalid', async () => {
    expect.assertions(1);

    expect(() => new ApplyVoucherCommand('wrong', 3.4))
      .toThrowError(ValidationError);
  });
});
