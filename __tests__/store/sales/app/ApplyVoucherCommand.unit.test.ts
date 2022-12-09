import { faker } from '@faker-js/faker';
import ApplyVoucherCommand, { ApplyVoucherCommandData } from '@sales/app/commands/ApplyVoucherCommand';
import { EventData } from '@shared/abstractions/IEventHandler';
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
      expect(e.errors).toHaveLength(2);
    }
  });

  it('calls mediator.send with correct params', async () => {
    expect.assertions(2);

    const sendSpy = jest.spyOn(mediatorStub, 'send');

    const command = new ApplyVoucherCommand(mediatorStub);

    const data: EventData<ApplyVoucherCommandData> = {
      principalId: faker.datatype.uuid(),
      customerId: faker.datatype.uuid(),
      voucherCode: parseInt(faker.datatype.number().toString(), 10),
      timestamp: new Date().toISOString(),
    };

    await command.send(data);

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith('ApplyVoucherCommand', data);
  });
});
