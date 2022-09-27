import RemovePurchaseOrderItemCommand from '@sales/app/commands/RemovePurchaseOrderItemCommand';
import { EventData } from '@shared/@types/events';
import ValidationError from '@shared/errors/ValidationError';
import MediatorStub from '../../stubs/MediatorStub';

describe("RemovePurchaseOrderItemCommand's unit tests", () => {
  it('throws a ValidationError if data is invalid', async () => {
    expect.assertions(2);

    const command = new RemovePurchaseOrderItemCommand(new MediatorStub());

    const data: EventData = {
      principalId: 'wrong',
      timestamp: new Date().toISOString(),
    };

    try {
      await command.send(data);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e.errors).toHaveLength(1);
    }
  });
});
