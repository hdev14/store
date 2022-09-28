import { faker } from '@faker-js/faker';
import RemovePurchaseOrderItemCommandHandler from '@sales/app/commands/RemovePurchaseOrderItemCommandHandler';
import { EventData } from '@shared/@types/events';
import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

describe("RemovePurchaseOrderItemCommandHandler's unit tests", () => {
  it('calls repository.deletePurchaseOrderItem with correct id', async () => {
    expect.assertions(2);

    const deletePurchaseOrderItemSpy = jest.spyOn(repositoryStub, 'deletePurchaseOrderItem');

    const handler = new RemovePurchaseOrderItemCommandHandler(repositoryStub);

    const data: EventData = {
      principalId: faker.datatype.uuid(),
      timestamp: new Date().toISOString(),
    };

    await handler.handle(data);

    expect(deletePurchaseOrderItemSpy).toHaveBeenCalledTimes(1);
    expect(deletePurchaseOrderItemSpy).toHaveBeenCalledWith(data.principalId);
  });
});
