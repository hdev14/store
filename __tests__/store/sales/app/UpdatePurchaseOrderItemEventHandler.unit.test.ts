import { faker } from '@faker-js/faker';
import UpdatePurchaseOrderItemEventHandler from '@sales/app/handlers/UpdatePurchaseOrderItemEventHandler';
import UpdatePurchaseOrderItemEvent from '@sales/domain/events/UpdatePurchaseOrderItemEvent';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';

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
        id: event.principalId,
        quantity: event.quantity,
        product: {
          id: event.productId,
          name: event.productName,
          amount: event.productAmount,
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

    try {
      await handler.handle(event);
    } catch (e: any) {
      expect(e).toBeInstanceOf(EventHandlerError);
      expect(e.message).toEqual('Erro ao atualizar um item.');
    }
  });
});
