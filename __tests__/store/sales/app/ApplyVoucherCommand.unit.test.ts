import ApplyVoucherCommand, { ApplyVoucherCommandData } from '@sales/app/commands/ApplyVoucherCommand';
import { EventData } from '@shared/@types/events';
import ValidationError from '@shared/errors/ValidationError';
import mediatorStub from '../../stubs/MediatorStub';

describe("ApplyVoucherCommand's unit tests", () => {
  it('throws a ValidationError if data is invalid', async () => {
    expect.assertions(2);

    const command = new ApplyVoucherCommand(mediatorStub);

    const data: EventData<ApplyVoucherCommandData> = {
      principalId: 'wrong',
      customerId: 'wrong',
      voucherCode: 3.4,
      timestamp: new Date().toISOString(),
    };

    try {
      await command.send(data);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e.errors).toHaveLength(3);
    }
  });
});
