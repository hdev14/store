import UpdatePurchaseOrderItemQuantityCommand, { UpdatePurchaseOrderItemQuantityCommandData } from '@sales/app/commands/UpdatePurchaseOrderItemQuantityCommand';
import { EventData } from '@shared/@types/events';
import ValidationError from '@shared/errors/ValidationError';
import MediatorStub from '../../stubs/MediatorStub';

describe("UpdatePurchaseOrderItemQuantityCommand's unit tests", () => {
  it('throws an exception of type ValidationError if data is invalid', async () => {
    expect.assertions(2);

    const command = new UpdatePurchaseOrderItemQuantityCommand(new MediatorStub());

    const data: EventData<UpdatePurchaseOrderItemQuantityCommandData> = {
      principalId: 'wrong',
      quantity: 7.3, // float
      timestamp: new Date().toISOString(),
    };

    try {
      await command.send(data);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e.errors).toHaveLength(2);
    }
  });
});
