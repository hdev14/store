import { faker } from '@faker-js/faker';
import AddPurchaseOrderItemCommand, { AddPurchaseOrderItemCommandData } from '@sales/app/commands/AddPurchaseOrderItemCommand';
import ValidationError from '@shared/errors/ValidationError';
import mediatorStub from '../../stubs/MediatorStub';

describe("AddPurchaseOrderItemCommand's unit tests", () => {
  it('throws an exception of type ValidationError if command data is invalid', async () => {
    expect.assertions(2);
    const addPurchaseOrderItemCommand = new AddPurchaseOrderItemCommand(mediatorStub);

    try {
      const invalidData: any = {
        customerId: 'wrong',
        principalId: 'wrong',
        productAmount: 'wrong',
        productId: 'wrong',
        productName: 123,
        quantity: 'wrong',
      };

      await addPurchaseOrderItemCommand.send(invalidData);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e.errors).toHaveLength(5);
    }
  });

  it('calls Mediator.send method with correct params', async () => {
    expect.assertions(2);

    const sendSpy = jest.spyOn(mediatorStub, 'send');

    const addPurchaseOrderItemCommand = new AddPurchaseOrderItemCommand(mediatorStub);

    const data: AddPurchaseOrderItemCommandData = {
      customerId: faker.datatype.uuid(),
      productId: faker.datatype.uuid(),
      productName: faker.commerce.product(),
      quantity: 1,
      productAmount: faker.datatype.float(),
    };

    await addPurchaseOrderItemCommand.send(data);

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith('AddPurchaseOrderItemCommand', data);
  });

  it('returns TRUE if mediator.send execute successfully', async () => {
    expect.assertions(1);

    mediatorStub.send = jest.fn().mockResolvedValueOnce(true);

    const addPurchaseOrderItemCommand = new AddPurchaseOrderItemCommand(mediatorStub);

    const data: AddPurchaseOrderItemCommandData = {
      customerId: faker.datatype.uuid(),
      productId: faker.datatype.uuid(),
      productName: faker.commerce.product(),
      quantity: 1,
      productAmount: faker.datatype.float(),
    };

    const result = await addPurchaseOrderItemCommand.send(data);

    expect(result).toBe(true);
  });

  it('returns FALSE if mediator.send fails', async () => {
    expect.assertions(1);

    mediatorStub.send = jest.fn().mockResolvedValueOnce(false);

    const addPurchaseOrderItemCommand = new AddPurchaseOrderItemCommand(mediatorStub);

    const data: AddPurchaseOrderItemCommandData = {
      customerId: faker.datatype.uuid(),
      productId: faker.datatype.uuid(),
      productName: faker.commerce.product(),
      quantity: 1,
      productAmount: faker.datatype.float(),
    };

    const result = await addPurchaseOrderItemCommand.send(data);

    expect(result).toBe(false);
  });
});
