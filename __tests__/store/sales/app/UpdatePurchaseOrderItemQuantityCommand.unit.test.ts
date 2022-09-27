import { faker } from '@faker-js/faker';
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

  it('calls Mediator.send method with correct params', async () => {
    expect.assertions(2);

    const mediator = new MediatorStub();
    const sendSpy = jest.spyOn(mediator, 'send');

    const command = new UpdatePurchaseOrderItemQuantityCommand(mediator);

    const data: EventData<UpdatePurchaseOrderItemQuantityCommandData> = {
      principalId: faker.datatype.uuid(),
      quantity: parseInt(faker.random.numeric(1), 10), // float
      timestamp: new Date().toISOString(),
    };

    await command.send(data);

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith('UpdatePurchaseOrderItemQuantityCommand', data);
  });

  it('returns TRUE if mediator.send execute successfully', async () => {
    expect.assertions(1);

    const mediator = new MediatorStub();

    mediator.send = jest.fn().mockResolvedValueOnce(true);

    const command = new UpdatePurchaseOrderItemQuantityCommand(mediator);

    const data: EventData<UpdatePurchaseOrderItemQuantityCommandData> = {
      principalId: faker.datatype.uuid(),
      quantity: parseInt(faker.random.numeric(1), 10), // float
      timestamp: new Date().toISOString(),
    };

    const result = await command.send(data);

    expect(result).toBe(true);
  });

  it('returns FALSE if mediator.send fails', async () => {
    expect.assertions(1);

    const mediator = new MediatorStub();

    mediator.send = jest.fn().mockResolvedValueOnce(false);

    const command = new UpdatePurchaseOrderItemQuantityCommand(mediator);

    const data: EventData<UpdatePurchaseOrderItemQuantityCommandData> = {
      principalId: faker.datatype.uuid(),
      quantity: parseInt(faker.random.numeric(1), 10), // float
      timestamp: new Date().toISOString(),
    };

    const result = await command.send(data);

    expect(result).toBe(false);
  });
});
