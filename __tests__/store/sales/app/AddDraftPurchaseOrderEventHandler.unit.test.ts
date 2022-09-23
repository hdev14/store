import { faker } from '@faker-js/faker';
import { AddDraftPurchaseOrderEventData } from '@sales/app/events/AddDraftPurchaseOrderEvent';
import AddDraftPurchaseOrderEventHandler from '@sales/app/events/AddDraftPurchaseOrderEventHandler';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import { EventData } from '@shared/@types/events';
import EventHandlerError from '@shared/errors/EventHandlerError';
import RepositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

describe("AddDraftPurchaseOrderEventHandler's unit tests", () => {
  it('calls repository.addPurchaseOrder with a draft purchase order', async () => {
    expect.assertions(2);

    const repository = new RepositoryStub();
    const addPurchaseOrderSpy = jest.spyOn(repository, 'addPurchaseOrder');
    const handler = new AddDraftPurchaseOrderEventHandler(repository);

    const eventData: EventData<AddDraftPurchaseOrderEventData> = {
      principalId: faker.datatype.uuid(),
      customerId: faker.datatype.uuid(),
      code: parseInt(faker.datatype.number().toString(), 10),
      totalAmount: faker.datatype.float(),
      discountAmount: faker.datatype.float(),
      createdAt: new Date(),
      timestamp: new Date().toISOString(),
      eventType: 'AddDraftPurchaseOrderEvent',
    };

    await handler.handle(eventData);

    expect(addPurchaseOrderSpy).toHaveBeenCalledTimes(1);
    expect(addPurchaseOrderSpy).toHaveBeenCalledWith(
      PurchaseOrder.createDraft({
        id: eventData.principalId,
        code: eventData.code,
        customerId: eventData.customerId,
        totalAmount: eventData.totalAmount,
        discountAmount: eventData.discountAmount,
        createdAt: eventData.createdAt,
        status: null,
        voucher: null,
      }),
    );
  });

  it('throws an EventHandlerError when occurs an expected error', async () => {
    expect.assertions(2);

    const repository = new RepositoryStub();
    repository.addPurchaseOrder = jest.fn().mockRejectedValueOnce(new Error('test'));

    const handler = new AddDraftPurchaseOrderEventHandler(repository);

    const eventData: EventData<AddDraftPurchaseOrderEventData> = {
      principalId: faker.datatype.uuid(),
      customerId: faker.datatype.uuid(),
      code: parseInt(faker.datatype.number().toString(), 10),
      totalAmount: faker.datatype.float(),
      discountAmount: faker.datatype.float(),
      createdAt: new Date(),
      timestamp: new Date().toISOString(),
      eventType: 'AddDraftPurchaseOrderEvent',
    };

    try {
      await handler.handle(eventData);
    } catch (e: any) {
      expect(e).toBeInstanceOf(EventHandlerError);
      expect(e.message).toEqual('Erro ao cadastrar o pedido.');
    }
  });
});
