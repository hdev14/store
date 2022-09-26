import { faker } from '@faker-js/faker';
import { UpdatePurchaserOrderItemEventData } from '@sales/app/events/UpdatePurchaseOrderItemEvent';
import UpdatePurchaseOrderItemEventHandler from '@sales/app/events/UpdatePurchaseOrderItemEventHandler';
import Product from '@sales/domain/Product';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import { EventData } from '@shared/@types/events';
import RepositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

describe("UpdatePurchaseOrderItemEventHandler's unit tests", () => {
  it('calls repository.updatePurchaseOrderItem with correct params', async () => {
    expect.assertions(2);

    const repository = new RepositoryStub();
    const updatePurchaseOrderItemSpy = jest.spyOn(repository, 'updatePurchaseOrderItem');

    const handler = new UpdatePurchaseOrderItemEventHandler(repository);

    const data: EventData<UpdatePurchaserOrderItemEventData> = {
      eventType: 'UpdatePurchaseOrderItemEvent',
      principalId: faker.datatype.uuid(),
      quantity: parseInt(faker.datatype.number().toString(), 10),
      productId: faker.datatype.uuid(),
      productName: faker.commerce.product(),
      productAmount: faker.datatype.float(),
      timestamp: new Date().toISOString(),
    };

    await handler.handle(data);

    expect(updatePurchaseOrderItemSpy).toHaveBeenCalledTimes(1);
    expect(updatePurchaseOrderItemSpy).toHaveBeenCalledWith(
      new PurchaseOrderItem({
        id: data.principalId,
        quantity: data.quantity,
        product: new Product(
          data.productId,
          data.productName,
          data.productAmount,
        ),
      }),
    );
  });
});
