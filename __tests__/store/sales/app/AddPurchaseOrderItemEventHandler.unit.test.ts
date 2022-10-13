import AddPurchaseOrderItemEventHandler from '@sales/app/events/AddPurchaseOrderItemEventHandler';
import { AddPurchaseOrderItemEventData } from '@sales/app/events/AddPurchaseOrderItemEvent';
import { faker } from '@faker-js/faker';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import Product from '@sales/domain/Product';
import EventHandlerError from '@shared/errors/EventHandlerError';
import { EventData } from '@shared/abstractions/IEventHandler';
import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

describe("AddPurchaseOrderItemEventHandler's unit tests", () => {
  it('calls repository.addPurchaseOrderItem with correct params', async () => {
    expect.assertions(2);

    const addPurchaseOrderItemSpy = jest.spyOn(repositoryStub, 'addPurchaseOrderItem');

    const handler = new AddPurchaseOrderItemEventHandler(repositoryStub);

    const eventData: EventData<AddPurchaseOrderItemEventData> = {
      principalId: faker.datatype.uuid(),
      productId: faker.datatype.uuid(),
      productName: faker.commerce.product(),
      productAmount: faker.datatype.float(),
      purchaseOrderId: faker.datatype.uuid(),
      quantity: faker.datatype.number(1),
      timestamp: new Date().toISOString(),
      eventType: 'AddPurchaseOrderItemEvent',
    };

    await handler.handle(eventData);

    expect(addPurchaseOrderItemSpy).toHaveBeenCalledTimes(1);
    expect(addPurchaseOrderItemSpy).toHaveBeenCalledWith(
      new PurchaseOrderItem({
        id: eventData.principalId,
        quantity: eventData.quantity,
        purchaseOrderId: eventData.purchaseOrderId,
        product: new Product(
          eventData.productId,
          eventData.productName,
          eventData.productAmount,
        ),
      }),
    );
  });

  it('throws an EventHandlerError when occurs an expected error', async () => {
    expect.assertions(2);

    repositoryStub.addPurchaseOrderItem = jest.fn().mockRejectedValueOnce(new Error('test'));

    const handler = new AddPurchaseOrderItemEventHandler(repositoryStub);

    const eventData: EventData<AddPurchaseOrderItemEventData> = {
      principalId: faker.datatype.uuid(),
      productId: faker.datatype.uuid(),
      productName: faker.commerce.product(),
      productAmount: faker.datatype.float(),
      purchaseOrderId: faker.datatype.uuid(),
      quantity: faker.datatype.number(1),
      timestamp: new Date().toISOString(),
      eventType: 'AddPurchaseOrderItemEvent',
    };

    try {
      await handler.handle(eventData);
    } catch (e: any) {
      expect(e).toBeInstanceOf(EventHandlerError);
      expect(e.message).toEqual('Erro ao cadastrar o item.');
    }
  });
});
