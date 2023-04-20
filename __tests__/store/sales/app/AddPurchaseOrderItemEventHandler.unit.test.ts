import { faker } from '@faker-js/faker';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import Product from '@sales/domain/Product';
import EventHandlerError from '@shared/errors/EventHandlerError';
import AddPurchaseOrderItemEventHandler from '@sales/app/handlers/AddPurchaseOrderItemEventHandler';
import AddPurchaseOrderItemEvent from '@sales/domain/events/AddPurchaseOrderItemEvent';
import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

describe("AddPurchaseOrderItemEventHandler's unit tests", () => {
  it('calls repository.addPurchaseOrderItem with correct params', async () => {
    expect.assertions(2);

    const addPurchaseOrderItemSpy = jest.spyOn(repositoryStub, 'addPurchaseOrderItem');

    const handler = new AddPurchaseOrderItemEventHandler(repositoryStub);

    const event = new AddPurchaseOrderItemEvent(
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      faker.datatype.number(1),
      faker.datatype.uuid(),
      faker.commerce.product(),
      faker.datatype.float(),
    );

    await handler.handle(event);

    expect(addPurchaseOrderItemSpy).toHaveBeenCalledTimes(1);
    expect(addPurchaseOrderItemSpy).toHaveBeenCalledWith(
      new PurchaseOrderItem({
        id: event.principalId,
        quantity: event.quantity,
        purchaseOrderId: event.purchaseOrderId,
        product: {
          id: event.productId,
          name: event.productName,
          amount: event.productAmount,
        },
      }),
    );
  });

  it('throws an EventHandlerError when occurs an expected error', () => {
    expect.assertions(2);

    repositoryStub.addPurchaseOrderItem = jest.fn().mockRejectedValueOnce(new Error('test'));

    const handler = new AddPurchaseOrderItemEventHandler(repositoryStub);

    const event = new AddPurchaseOrderItemEvent(
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      faker.datatype.number(1),
      faker.datatype.uuid(),
      faker.commerce.product(),
      faker.datatype.float(),
    );

    return handler.handle(event).catch((e: any) => {
      expect(e).toBeInstanceOf(EventHandlerError);
      expect(e.message).toEqual('Erro ao cadastrar o item.');
    });
  });
});
