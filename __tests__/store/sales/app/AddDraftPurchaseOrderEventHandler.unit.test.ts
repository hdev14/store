import { faker } from '@faker-js/faker';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import EventHandlerError from '@shared/errors/EventHandlerError';
import AddDraftPurchaseOrderEventHandler from '@sales/app/handlers/AddDraftPurchaseOrderEventHandler';
import AddDraftPurchaseOrderEvent from '@sales/domain/events/AddDraftPurchaseOrderEvent';
import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

describe("AddDraftPurchaseOrderEventHandler's unit tests", () => {
  it('calls repository.addPurchaseOrder with a draft purchase order', async () => {
    expect.assertions(2);

    const addPurchaseOrderSpy = jest.spyOn(repositoryStub, 'addPurchaseOrder');
    const handler = new AddDraftPurchaseOrderEventHandler(repositoryStub);

    const event = new AddDraftPurchaseOrderEvent(
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      faker.datatype.float(),
      faker.datatype.float(),
      new Date(),
      parseInt(faker.datatype.number().toString(), 10),
    );

    await handler.handle(event);

    expect(addPurchaseOrderSpy).toHaveBeenCalledTimes(1);
    expect(addPurchaseOrderSpy).toHaveBeenCalledWith(
      PurchaseOrder.createDraft({
        id: event.principalId,
        code: event.code,
        customerId: event.customerId,
        totalAmount: event.totalAmount,
        discountAmount: event.discountAmount,
        createdAt: event.createdAt,
        status: null,
        voucher: null,
        items: [],
      }),
    );
  });

  it('throws an EventHandlerError when occurs an expected error', async () => {
    expect.assertions(2);

    repositoryStub.addPurchaseOrder = jest.fn().mockRejectedValueOnce(new Error('test'));

    const handler = new AddDraftPurchaseOrderEventHandler(repositoryStub);

    const event = new AddDraftPurchaseOrderEvent(
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      faker.datatype.float(),
      faker.datatype.float(),
      new Date(),
      parseInt(faker.datatype.number().toString(), 10),
    );

    try {
      await handler.handle(event);
    } catch (e: any) {
      expect(e).toBeInstanceOf(EventHandlerError);
      expect(e.message).toEqual('Erro ao cadastrar o pedido.');
    }
  });
});
