import { faker } from '@faker-js/faker';
import { UpdatePurchaserOrderItemEventData } from '@sales/app/events/UpdatePurchaseOrderItemEvent';
import UpdatePurchaseOrderItemEventHandler from '@sales/app/events/UpdatePurchaseOrderItemEventHandler';
import Product from '@sales/domain/Product';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import { EventData } from '@shared/@types/events';
import EventHandlerError from '@shared/errors/EventHandlerError';
import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

describe("UpdatePurchaseOrderItemEventHandler's unit tests", () => {
  it('calls repository.updatePurchaseOrderItem with correct params', async () => {
    expect.assertions(2);

    const updatePurchaseOrderItemSpy = jest.spyOn(repositoryStub, 'updatePurchaseOrderItem');

    const handler = new UpdatePurchaseOrderItemEventHandler(repositoryStub);

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

  it('throws a EventHandlerError if occurs an expected error', async () => {
    expect.assertions(2);

    repositoryStub.updatePurchaseOrderItem = jest.fn().mockRejectedValueOnce(new Error('test'));

    const handler = new UpdatePurchaseOrderItemEventHandler(repositoryStub);

    const data: EventData<UpdatePurchaserOrderItemEventData> = {
      eventType: 'UpdatePurchaseOrderItemEvent',
      principalId: faker.datatype.uuid(),
      quantity: parseInt(faker.datatype.number().toString(), 10),
      productId: faker.datatype.uuid(),
      productName: faker.commerce.product(),
      productAmount: faker.datatype.float(),
      timestamp: new Date().toISOString(),
    };

    try {
      await handler.handle(data);
    } catch (e: any) {
      expect(e).toBeInstanceOf(EventHandlerError);
      expect(e.message).toEqual('Erro ao atualizar um item.');
    }
  });
});
