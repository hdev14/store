import { faker } from '@faker-js/faker';
import UpdatePurchaseOrderItemEventHandler from '@sales/app/handlers/UpdatePurchaseOrderItemEventHandler';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import UpdatePurchaseOrderItemEvent from '@sales/domain/events/UpdatePurchaseOrderItemEvent';
import EventHandlerError from '@shared/errors/EventHandlerError';
import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

describe("UpdatePurchaseOrderItemEventHandler's unit tests", () => {
  it('calls repository.updatePurchaseOrderItem with correct params', async () => {
    expect.assertions(2);

    const updatePurchaseOrderItemSpy = jest.spyOn(repositoryStub, 'updatePurchaseOrderItem');

    const handler = new UpdatePurchaseOrderItemEventHandler(repositoryStub);

    const event = new UpdatePurchaseOrderItemEvent(
      faker.datatype.uuid(),
      parseInt(faker.datatype.number().toString(), 10),
      faker.datatype.uuid(),
      faker.commerce.product(),
      faker.datatype.float(),
    );

    await handler.handle(event);

    expect(updatePurchaseOrderItemSpy).toHaveBeenCalledTimes(1);
    expect(updatePurchaseOrderItemSpy).toHaveBeenCalledWith(
      new PurchaseOrderItem({
        id: event.principal_id,
        quantity: event.quantity,
        product: {
          id: event.product_id,
          name: event.product_name,
          amount: event.product_amount,
        },
      }),
    );
  });

  it('throws a EventHandlerError if occurs an expected error', async () => {
    expect.assertions(2);

    repositoryStub.updatePurchaseOrderItem = jest.fn().mockRejectedValueOnce(new Error('test'));

    const handler = new UpdatePurchaseOrderItemEventHandler(repositoryStub);

    const event = new UpdatePurchaseOrderItemEvent(
      faker.datatype.uuid(),
      parseInt(faker.datatype.number().toString(), 10),
      faker.datatype.uuid(),
      faker.commerce.product(),
      faker.datatype.float(),
    );

    return handler.handle(event).catch((e: any) => {
      expect(e).toBeInstanceOf(EventHandlerError);
      expect(e.message).toEqual('Erro ao atualizar um item.');
    });
  });
});
