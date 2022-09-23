import { faker } from '@faker-js/faker';
import { UpdateDraftPurchaseOrderEventData } from '@sales/app/events/UpdateDraftPurchaseOrderEvent';
import UpdateDraftPurchaseOrderEventHandler from '@sales/app/events/UpdateDraftPurchaseOrderEventHandler';
import { EventData } from '@shared/@types/events';
import EventHandlerError from '@shared/errors/EventHandlerError';
import RepositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

describe("UpdateDraftPurchaseOrderEventHandler's unit tests", () => {
  it('calls repository.updatePurchaseOrder with correct params', async () => {
    expect.assertions(6);

    const repository = new RepositoryStub();

    const updatePurchaseOrderSpy = jest.spyOn(repository, 'updatePurchaseOrder');

    const handler = new UpdateDraftPurchaseOrderEventHandler(repository);

    const eventData: EventData<UpdateDraftPurchaseOrderEventData> = {
      eventType: 'UpdateDraftPurchaseOrderEvent',
      principalId: faker.datatype.uuid(),
      customerId: faker.datatype.uuid(),
      code: parseInt(faker.datatype.number().toString(), 10),
      discountAmount: faker.datatype.float(),
      totalAmount: faker.datatype.float(),
      timestamp: new Date().toISOString(),
    };

    await handler.handle(eventData);

    expect(updatePurchaseOrderSpy).toHaveBeenCalledTimes(1);
    expect(updatePurchaseOrderSpy.mock.calls[0][0].id).toEqual(eventData.principalId);
    expect(updatePurchaseOrderSpy.mock.calls[0][0].code).toEqual(eventData.code);
    expect(updatePurchaseOrderSpy.mock.calls[0][0].customerId).toEqual(eventData.customerId);
    expect(updatePurchaseOrderSpy.mock.calls[0][0].totalAmount).toEqual(eventData.totalAmount);
    expect(updatePurchaseOrderSpy.mock.calls[0][0].discountAmount)
      .toEqual(eventData.discountAmount);
  });

  it('throws an EventHandlerError when occurs an expected error', async () => {
    expect.assertions(2);

    const repository = new RepositoryStub();

    repository.updatePurchaseOrder = jest.fn().mockRejectedValueOnce(new Error('test'));

    const handler = new UpdateDraftPurchaseOrderEventHandler(repository);

    const eventData: EventData<UpdateDraftPurchaseOrderEventData> = {
      eventType: 'UpdateDraftPurchaseOrderEvent',
      principalId: faker.datatype.uuid(),
      customerId: faker.datatype.uuid(),
      code: parseInt(faker.datatype.number().toString(), 10),
      discountAmount: faker.datatype.float(),
      totalAmount: faker.datatype.float(),
      timestamp: new Date().toISOString(),
    };

    try {
      await handler.handle(eventData);
    } catch (e: any) {
      expect(e).toBeInstanceOf(EventHandlerError);
      expect(e.message).toEqual('Erro ao atualizar o pedido.');
    }
  });
});
