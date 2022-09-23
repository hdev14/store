import AddPurchaseOrderItemEventHandler from '@sales/app/events/AddPurchaseOrderItemEventHandler';
import { EventData } from '@shared/@types/events';
import { AddPurchaseOrderItemEventData } from '@sales/app/events/AddPurchaseOrderItemEvent';
import { faker } from '@faker-js/faker';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import Product from '@sales/domain/Product';
import RepositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

describe("AddPurchaseOrderItemEventHandler's unit tests", () => {
  it('calls repository.addPurchaseOrderItem with correct params', async () => {
    expect.assertions(2);

    const repository = new RepositoryStub();
    const addPurchaseOrderItemSpy = jest.spyOn(repository, 'addPurchaseOrderItem');

    const handler = new AddPurchaseOrderItemEventHandler(repository);

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
});
