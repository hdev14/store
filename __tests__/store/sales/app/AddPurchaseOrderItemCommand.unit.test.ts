import AddPurchaseOrderItemCommand from '@sales/app/AddPurchaseOrderItemCommand';
import { EventData } from '@shared/@types/events';
import EventMediator from '@shared/abstractions/EventMediator';
import ValidationError from '@shared/errors/ValidationError';

class MediatorStub extends EventMediator {
  public send<R, T = {}>(_name: string, _data: EventData<T>): Promise<void | R> {
    throw new Error('Method not implemented.');
  }
}

describe("AddPurchaseOrderItemCommand's unit tests", () => {
  it('throws an exception of type ValidationError if command data is invalid', async () => {
    expect.assertions(2);
    const addPurchaseOrderItemCommand = new AddPurchaseOrderItemCommand(new MediatorStub());

    try {
      const invalidData: any = {
        clientId: 'wrong',
        principalId: 'wrong',
        productAmount: 'wrong',
        productId: 'wrong',
        productName: 123,
        quantity: 'wrong',
        timestamp: new Date().toISOString(),
      };

      await addPurchaseOrderItemCommand.send(invalidData);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e.errors).toHaveLength(6);
    }
  });
});
