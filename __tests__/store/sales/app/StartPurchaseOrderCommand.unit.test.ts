import StartPurchaseOrderCommand from '@sales/app/commands/StartPurchaseOrderCommand';
import { EventData } from '@shared/abstractions/IEventHandler';
import ValidationError from '@shared/errors/ValidationError';
import mediatorStub from '../../stubs/MediatorStub';

describe("StartPurchaseOrderCommand's unit tests", () => {
  it('throws a ValidationError if data is invalid', async () => {
    expect.assertions(2);

    const command = new StartPurchaseOrderCommand(mediatorStub);

    const data: EventData<any> = {
      principalId: 'wrong',
      cardToken: 123,
      installments: -1,
    };

    try {
      await command.execute(data);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e.errors).toHaveLength(3);
    }
  });
});
