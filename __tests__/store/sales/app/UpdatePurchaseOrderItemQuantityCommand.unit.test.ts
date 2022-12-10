import { faker } from '@faker-js/faker';
import UpdatePurchaseOrderItemQuantityCommand, { UpdatePurchaseOrderItemQuantityCommandData } from '@sales/app/commands/UpdatePurchaseOrderItemQuantityCommand';
import ValidationError from '@shared/errors/ValidationError';
import mediatorStub from '../../stubs/MediatorStub';

describe("UpdatePurchaseOrderItemQuantityCommand's unit tests", () => {
  it('throws an exception of type ValidationError if data is invalid', async () => {
    expect.assertions(2);

    const command = new UpdatePurchaseOrderItemQuantityCommand(mediatorStub);

    const data: UpdatePurchaseOrderItemQuantityCommandData = {
      purchaseOrderItemId: 'wrong',
      quantity: 7.3, // float
    };

    try {
      await command.execute(data);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e.errors).toHaveLength(2);
    }
  });

  it('calls Mediator.send method with correct params', async () => {
    expect.assertions(2);

    const sendSpy = jest.spyOn(mediatorStub, 'send');

    const command = new UpdatePurchaseOrderItemQuantityCommand(mediatorStub);

    const data: UpdatePurchaseOrderItemQuantityCommandData = {
      purchaseOrderItemId: faker.datatype.uuid(),
      quantity: parseInt(faker.random.numeric(1), 10), // float
    };

    await command.execute(data);

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith('UpdatePurchaseOrderItemQuantityCommand', data);
  });

  it('returns TRUE if mediator.send execute successfully', async () => {
    expect.assertions(1);

    mediatorStub.send = jest.fn().mockResolvedValueOnce(true);

    const command = new UpdatePurchaseOrderItemQuantityCommand(mediatorStub);

    const data: UpdatePurchaseOrderItemQuantityCommandData = {
      purchaseOrderItemId: faker.datatype.uuid(),
      quantity: parseInt(faker.random.numeric(1), 10), // float
    };

    const result = await command.execute(data);

    expect(result).toBe(true);
  });

  it('returns FALSE if mediator.send fails', async () => {
    expect.assertions(1);

    mediatorStub.send = jest.fn().mockResolvedValueOnce(false);

    const command = new UpdatePurchaseOrderItemQuantityCommand(mediatorStub);

    const data: UpdatePurchaseOrderItemQuantityCommandData = {
      purchaseOrderItemId: faker.datatype.uuid(),
      quantity: parseInt(faker.random.numeric(1), 10), // float
    };

    const result = await command.execute(data);

    expect(result).toBe(false);
  });
});
