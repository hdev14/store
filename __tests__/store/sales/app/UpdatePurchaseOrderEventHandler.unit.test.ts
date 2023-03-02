import { faker } from '@faker-js/faker';
import UpdateDraftPurchaseOrderEventHandler from '@sales/app/handlers/UpdateDraftPurchaseOrderEventHandler';
import UpdateDraftPurchaseOrderEvent from '@sales/domain/events/UpdateDraftPurchaseOrderEvent';
import EventHandlerError from '@shared/errors/EventHandlerError';
import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

describe("UpdateDraftPurchaseOrderEventHandler's unit tests", () => {
  it('calls repository.updatePurchaseOrder with correct params', async () => {
    expect.assertions(6);

    const updatePurchaseOrderSpy = jest.spyOn(repositoryStub, 'updatePurchaseOrder');

    const handler = new UpdateDraftPurchaseOrderEventHandler(repositoryStub);

    const event = new UpdateDraftPurchaseOrderEvent(
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      parseInt(faker.datatype.number().toString(), 10),
      faker.datatype.float(),
      faker.datatype.float(),
    );

    await handler.handle(event);

    expect(updatePurchaseOrderSpy).toHaveBeenCalledTimes(1);
    expect(updatePurchaseOrderSpy.mock.calls[0][0].id).toEqual(event.principalId);
    expect(updatePurchaseOrderSpy.mock.calls[0][0].code).toEqual(event.code);
    expect(updatePurchaseOrderSpy.mock.calls[0][0].customerId).toEqual(event.customerId);
    expect(updatePurchaseOrderSpy.mock.calls[0][0].totalAmount).toEqual(event.totalAmount);
    expect(updatePurchaseOrderSpy.mock.calls[0][0].discountAmount)
      .toEqual(event.discountAmount);
  });

  it('throws an EventHandlerError when occurs an expected error', async () => {
    expect.assertions(2);

    repositoryStub.updatePurchaseOrder = jest.fn().mockRejectedValueOnce(new Error('test'));

    const handler = new UpdateDraftPurchaseOrderEventHandler(repositoryStub);

    const event = new UpdateDraftPurchaseOrderEvent(
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      parseInt(faker.datatype.number().toString(), 10),
      faker.datatype.float(),
      faker.datatype.float(),
    );

    try {
      await handler.handle(event);
    } catch (e: any) {
      expect(e).toBeInstanceOf(EventHandlerError);
      expect(e.message).toEqual('Erro ao atualizar o pedido.');
    }
  });
});
