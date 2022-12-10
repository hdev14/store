import { faker } from '@faker-js/faker';
import RemovePurchaseOrderItemCommand, { RemovePurchaseOrderItemCommandData } from '@sales/app/commands/RemovePurchaseOrderItemCommand';
import ValidationError from '@shared/errors/ValidationError';
import mediatorStub from '../../stubs/MediatorStub';

describe("RemovePurchaseOrderItemCommand's unit tests", () => {
  it('throws a ValidationError if data is invalid', async () => {
    expect.assertions(2);

    const command = new RemovePurchaseOrderItemCommand(mediatorStub);

    const data: RemovePurchaseOrderItemCommandData = {
      purchaseOrderItemId: 'wrong',
    };

    try {
      await command.execute(data);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e.errors).toHaveLength(1);
    }
  });

  it('calls mediator.send method', async () => {
    expect.assertions(2);

    const sendSpy = jest.spyOn(mediatorStub, 'send');

    const command = new RemovePurchaseOrderItemCommand(mediatorStub);

    const data: RemovePurchaseOrderItemCommandData = {
      purchaseOrderItemId: faker.datatype.uuid(),
    };

    await command.execute(data);

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith('RemovePurchaseOrderItemCommand', data);
  });
});
