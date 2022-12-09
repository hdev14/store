import { faker } from '@faker-js/faker';
import { RemovePurchaseOrderItemCommandData } from '@sales/app/commands/RemovePurchaseOrderItemCommand';
import RemovePurchaseOrderItemCommandHandler from '@sales/app/commands/RemovePurchaseOrderItemCommandHandler';
import RemovePurchaseOrderItemEvent from '@sales/app/events/RemovePurchaseOrderItemEvent';
import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';
import publisherStub from '../../stubs/EventPublisherStub';

describe("RemovePurchaseOrderItemCommandHandler's unit tests", () => {
  it('calls repository.deletePurchaseOrderItem with correct id', async () => {
    expect.assertions(2);

    const deletePurchaseOrderItemSpy = jest.spyOn(repositoryStub, 'deletePurchaseOrderItem');

    const handler = new RemovePurchaseOrderItemCommandHandler(repositoryStub, publisherStub);

    const data: RemovePurchaseOrderItemCommandData = {
      purchaseOrderItemId: faker.datatype.uuid(),
    };

    await handler.handle(data);

    expect(deletePurchaseOrderItemSpy).toHaveBeenCalledTimes(1);
    expect(deletePurchaseOrderItemSpy).toHaveBeenCalledWith(data.purchaseOrderItemId);
  });

  it('returns TRUE after remove purchase order item', async () => {
    expect.assertions(1);

    repositoryStub.deletePurchaseOrderItem = jest.fn().mockResolvedValueOnce(true);

    const handler = new RemovePurchaseOrderItemCommandHandler(repositoryStub, publisherStub);

    const data: RemovePurchaseOrderItemCommandData = {
      purchaseOrderItemId: faker.datatype.uuid(),
    };

    const result = await handler.handle(data);

    expect(result).toBe(true);
  });

  it('returns FALSE if occurs an expected error', async () => {
    expect.assertions(1);

    repositoryStub.deletePurchaseOrderItem = jest.fn().mockRejectedValueOnce(new Error('test'));

    const handler = new RemovePurchaseOrderItemCommandHandler(repositoryStub, publisherStub);

    const data: RemovePurchaseOrderItemCommandData = {
      purchaseOrderItemId: faker.datatype.uuid(),
    };

    const result = await handler.handle(data);

    expect(result).toBe(false);
  });

  it('calls publisher.addEvent with correct params', async () => {
    expect.assertions(3);

    repositoryStub.deletePurchaseOrderItem = jest.fn().mockResolvedValueOnce(true);

    const addEventSpy = jest.spyOn(publisherStub, 'addEvent');

    const handler = new RemovePurchaseOrderItemCommandHandler(
      repositoryStub,
      publisherStub,
    );

    const data: RemovePurchaseOrderItemCommandData = {
      purchaseOrderItemId: faker.datatype.uuid(),
    };

    await handler.handle(data);

    expect(addEventSpy).toHaveBeenCalledTimes(1);
    expect(addEventSpy.mock.calls[0][0]).toEqual(RemovePurchaseOrderItemEvent);

    const secondParam: any = addEventSpy.mock.calls[0][1];
    expect(secondParam.principalId).toEqual(data.purchaseOrderItemId);
  });

  it('calls publisher.sendEvents after the logic', async () => {
    expect.assertions(1);

    const sendEventsSpy = jest.spyOn(publisherStub, 'sendEvents');

    const handler = new RemovePurchaseOrderItemCommandHandler(
      repositoryStub,
      publisherStub,
    );

    const data: RemovePurchaseOrderItemCommandData = {
      purchaseOrderItemId: faker.datatype.uuid(),
    };

    await handler.handle(data);

    expect(sendEventsSpy).toHaveBeenCalledTimes(1);
  });
});
