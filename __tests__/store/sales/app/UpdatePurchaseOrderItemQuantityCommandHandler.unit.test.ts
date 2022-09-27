import { faker } from '@faker-js/faker';
import { UpdatePurchaseOrderItemQuantityCommandData } from '@sales/app/commands/UpdatePurchaseOrderItemQuantityCommand';
import UpdatePurchaseOrderItemQuantityCommandHandler from '@sales/app/commands/UpdatePurchaseOrderItemQuantityCommandHandler';
import Product from '@sales/domain/Product';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import { EventData } from '@shared/@types/events';
import EventMediator from '@shared/abstractions/EventMediator';
import UpdatePurchaseOrderItemEvent from '@sales/app/events/UpdatePurchaseOrderItemEvent';
import RepositoryStub from '../../stubs/PurchaseOrderRepositoryStub';
import PublisherStub from '../../stubs/EventPublisherStub';

describe("UpdatePurchaseOrderItemQuantityCommandHandler's unit test", () => {
  it('calls repository.getPurchaseOrderItemById', async () => {
    expect.assertions(2);

    const repository = new RepositoryStub();
    const getPurchaseOrderItemByIdSpy = jest.spyOn(repository, 'getPurchaseOrderItemById');

    const handler = new UpdatePurchaseOrderItemQuantityCommandHandler(
      repository,
      new PublisherStub({} as EventMediator),
    );

    const data: EventData<UpdatePurchaseOrderItemQuantityCommandData> = {
      principalId: faker.datatype.uuid(),
      quantity: parseInt(faker.datatype.number().toString(), 10),
      timestamp: new Date().toISOString(),
    };

    await handler.handle(data);

    expect(getPurchaseOrderItemByIdSpy).toHaveBeenCalledTimes(1);
    expect(getPurchaseOrderItemByIdSpy).toHaveBeenCalledWith(data.principalId);
  });

  it("return FALSE if purchase order item doesn't exist", async () => {
    expect.assertions(1);

    const repository = new RepositoryStub();
    repository.getPurchaseOrderItemById = jest.fn().mockResolvedValueOnce(null);

    const handler = new UpdatePurchaseOrderItemQuantityCommandHandler(
      repository,
      new PublisherStub({} as EventMediator),
    );

    const data: EventData<UpdatePurchaseOrderItemQuantityCommandData> = {
      principalId: faker.datatype.uuid(),
      quantity: parseInt(faker.datatype.number().toString(), 10),
      timestamp: new Date().toISOString(),
    };

    const result = await handler.handle(data);

    expect(result).toBe(false);
  });

  it('calls repository.updatePurchaseOrderItem if found the item', async () => {
    expect.assertions(3);

    const repository = new RepositoryStub();
    const fakePurchaseOrderItem = new PurchaseOrderItem({
      id: faker.datatype.uuid(),
      quantity: parseInt(faker.datatype.number().toString(), 10),
      purchaseOrderId: faker.datatype.uuid(),
      product: new Product(
        faker.datatype.uuid(),
        faker.commerce.product(),
        faker.datatype.float(),
      ),
    });

    repository.getPurchaseOrderItemById = jest.fn().mockResolvedValueOnce(fakePurchaseOrderItem);
    const updatePurchaseOrderItemSpy = jest.spyOn(repository, 'updatePurchaseOrderItem');

    const handler = new UpdatePurchaseOrderItemQuantityCommandHandler(
      repository,
      new PublisherStub({} as EventMediator),
    );

    const data: EventData<UpdatePurchaseOrderItemQuantityCommandData> = {
      principalId: faker.datatype.uuid(),
      quantity: parseInt(faker.datatype.number().toString(), 10),
      timestamp: new Date().toISOString(),
    };

    const expectedPurchaseOrderItem = fakePurchaseOrderItem;
    expectedPurchaseOrderItem.quantity = data.quantity;

    const result = await handler.handle(data);

    expect(updatePurchaseOrderItemSpy).toHaveBeenCalledTimes(1);
    expect(updatePurchaseOrderItemSpy).toHaveBeenCalledWith(expectedPurchaseOrderItem);
    expect(result).toEqual(true);
  });

  it('returns FALSE if occurs an expected error', async () => {
    expect.assertions(1);

    const repository = new RepositoryStub();
    repository.getPurchaseOrderItemById = jest.fn().mockRejectedValueOnce(new Error('test'));

    const handler = new UpdatePurchaseOrderItemQuantityCommandHandler(
      repository,
      new PublisherStub({} as EventMediator),
    );

    const data: EventData<UpdatePurchaseOrderItemQuantityCommandData> = {
      principalId: faker.datatype.uuid(),
      quantity: parseInt(faker.datatype.number().toString(), 10),
      timestamp: new Date().toISOString(),
    };

    const result = await handler.handle(data);

    expect(result).toBe(false);
  });

  it('calls publisher.addEvent with correct params', async () => {
    expect.assertions(7);

    const repository = new RepositoryStub();
    const fakePurchaseOrderItem = new PurchaseOrderItem({
      id: faker.datatype.uuid(),
      quantity: parseInt(faker.datatype.number().toString(), 10),
      purchaseOrderId: faker.datatype.uuid(),
      product: new Product(
        faker.datatype.uuid(),
        faker.commerce.product(),
        faker.datatype.float(),
      ),
    });
    repository.getPurchaseOrderItemById = jest.fn().mockResolvedValueOnce(fakePurchaseOrderItem);

    const publisher = new PublisherStub({} as EventMediator);
    const addEventSpy = jest.spyOn(publisher, 'addEvent');

    const handler = new UpdatePurchaseOrderItemQuantityCommandHandler(repository, publisher);

    const data: EventData<UpdatePurchaseOrderItemQuantityCommandData> = {
      principalId: faker.datatype.uuid(),
      quantity: parseInt(faker.datatype.number().toString(), 10),
      timestamp: new Date().toISOString(),
    };

    const expectedPurchaseOrderItem = fakePurchaseOrderItem;
    expectedPurchaseOrderItem.quantity = data.quantity;

    await handler.handle(data);

    expect(addEventSpy).toHaveBeenCalledTimes(1);
    expect(addEventSpy.mock.calls[0][0]).toEqual(UpdatePurchaseOrderItemEvent);

    const secondParam: any = addEventSpy.mock.calls[0][1];

    expect(secondParam.principalId).toEqual(expectedPurchaseOrderItem.id);
    expect(secondParam.quantity).toEqual(expectedPurchaseOrderItem.quantity);
    expect(secondParam.productId).toEqual(expectedPurchaseOrderItem.product.id);
    expect(secondParam.productName).toEqual(expectedPurchaseOrderItem.product.name);
    expect(secondParam.productAmount).toEqual(expectedPurchaseOrderItem.product.amount);
  });

  it('calls publisher.sendEvents after the operation', async () => {
    expect.assertions(1);

    const repository = new RepositoryStub();
    const fakePurchaseOrderItem = new PurchaseOrderItem({
      id: faker.datatype.uuid(),
      quantity: parseInt(faker.datatype.number().toString(), 10),
      purchaseOrderId: faker.datatype.uuid(),
      product: new Product(
        faker.datatype.uuid(),
        faker.commerce.product(),
        faker.datatype.float(),
      ),
    });
    repository.getPurchaseOrderItemById = jest.fn().mockResolvedValueOnce(fakePurchaseOrderItem);

    const publisher = new PublisherStub({} as EventMediator);
    const sendEventsSpy = jest.spyOn(publisher, 'sendEvents');

    const handler = new UpdatePurchaseOrderItemQuantityCommandHandler(repository, publisher);

    const data: EventData<UpdatePurchaseOrderItemQuantityCommandData> = {
      principalId: faker.datatype.uuid(),
      quantity: parseInt(faker.datatype.number().toString(), 10),
      timestamp: new Date().toISOString(),
    };

    const expectedPurchaseOrderItem = fakePurchaseOrderItem;
    expectedPurchaseOrderItem.quantity = data.quantity;

    await handler.handle(data);

    expect(sendEventsSpy).toHaveBeenCalledTimes(1);
  });
});
