import { faker } from '@faker-js/faker';
import AddDraftPurchaseOrderEventHandler from '@sales/app/handlers/AddDraftPurchaseOrderEventHandler';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import AddDraftPurchaseOrderEvent from '@sales/domain/events/AddDraftPurchaseOrderEvent';
import EventHandlerError from '@shared/errors/EventHandlerError';
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
        id: event.principal_id,
        code: event.code,
        customer_id: event.customer_id,
        total_amount: event.total_amount,
        discount_amount: event.discount_amount,
        created_at: event.created_at,
        status: null,
        voucher: null,
        items: [],
      }),
    );
  });

  it('throws an EventHandlerError when occurs an expected error', () => {
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

    return handler.handle(event).catch((e: any) => {
      expect(e).toBeInstanceOf(EventHandlerError);
      expect(e.message).toEqual('Erro ao cadastrar o pedido.');
    });
  });
});
