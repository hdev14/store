import { faker } from '@faker-js/faker';
import { UpdatePurchaseOrderItemQuantityCommandData } from '@sales/app/commands/UpdatePurchaseOrderItemQuantityCommand';
import UpdatePurchaseOrderItemQuantityCommandHandler from '@sales/app/commands/UpdatePurchaseOrderItemQuantityCommandHandler';
import Product from '@sales/domain/Product';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import UpdatePurchaseOrderItemEvent from '@sales/app/events/UpdatePurchaseOrderItemEvent';
import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';
import publisherStub from '../../stubs/EventPublisherStub';

describe("UpdatePurchaseOrderItemQuantityCommandHandler's unit test", () => {
  it('calls repositoryStub.getPurchaseOrderItemById', async () => {
    expect.assertions(2);

    const getPurchaseOrderItemByIdSpy = jest.spyOn(repositoryStub, 'getPurchaseOrderItemById');

    const handler = new UpdatePurchaseOrderItemQuantityCommandHandler(
      repositoryStub,
      publisherStub,
    );

    const data: UpdatePurchaseOrderItemQuantityCommandData = {
      purchaseOrderItemId: faker.datatype.uuid(),
      quantity: parseInt(faker.datatype.number().toString(), 10),
    };

    await handler.handle(data);

    expect(getPurchaseOrderItemByIdSpy).toHaveBeenCalledTimes(1);
    expect(getPurchaseOrderItemByIdSpy).toHaveBeenCalledWith(data.purchaseOrderItemId);
  });

  it("return FALSE if purchase order item doesn't exist", async () => {
    expect.assertions(1);

    repositoryStub.getPurchaseOrderItemById = jest.fn().mockResolvedValueOnce(null);

    const handler = new UpdatePurchaseOrderItemQuantityCommandHandler(
      repositoryStub,
      publisherStub,
    );

    const data: UpdatePurchaseOrderItemQuantityCommandData = {
      purchaseOrderItemId: faker.datatype.uuid(),
      quantity: parseInt(faker.datatype.number().toString(), 10),
    };

    const result = await handler.handle(data);

    expect(result).toBe(false);
  });

  it('calls repository.updatePurchaseOrderItem if found the item', async () => {
    expect.assertions(3);

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

    repositoryStub.getPurchaseOrderItemById = jest.fn()
      .mockResolvedValueOnce(fakePurchaseOrderItem);

    const updatePurchaseOrderItemSpy = jest.spyOn(repositoryStub, 'updatePurchaseOrderItem');

    const handler = new UpdatePurchaseOrderItemQuantityCommandHandler(
      repositoryStub,
      publisherStub,
    );

    const data: UpdatePurchaseOrderItemQuantityCommandData = {
      purchaseOrderItemId: faker.datatype.uuid(),
      quantity: parseInt(faker.datatype.number().toString(), 10),
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

    repositoryStub.getPurchaseOrderItemById = jest.fn().mockRejectedValueOnce(new Error('test'));

    const handler = new UpdatePurchaseOrderItemQuantityCommandHandler(
      repositoryStub,
      publisherStub,
    );

    const data: UpdatePurchaseOrderItemQuantityCommandData = {
      purchaseOrderItemId: faker.datatype.uuid(),
      quantity: parseInt(faker.datatype.number().toString(), 10),
    };

    const result = await handler.handle(data);

    expect(result).toBe(false);
  });

  it('calls publisher.addEvent with correct params', async () => {
    expect.assertions(7);

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

    repositoryStub.getPurchaseOrderItemById = jest.fn()
      .mockResolvedValueOnce(fakePurchaseOrderItem);

    const addEventSpy = jest.spyOn(publisherStub, 'addEvent');

    const handler = new UpdatePurchaseOrderItemQuantityCommandHandler(
      repositoryStub,
      publisherStub,
    );

    const data: UpdatePurchaseOrderItemQuantityCommandData = {
      purchaseOrderItemId: faker.datatype.uuid(),
      quantity: parseInt(faker.datatype.number().toString(), 10),
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

    repositoryStub.getPurchaseOrderItemById = jest.fn()
      .mockResolvedValueOnce(fakePurchaseOrderItem);

    const sendEventsSpy = jest.spyOn(publisherStub, 'sendEvents');

    const handler = new UpdatePurchaseOrderItemQuantityCommandHandler(
      repositoryStub,
      publisherStub,
    );

    const data: UpdatePurchaseOrderItemQuantityCommandData = {
      purchaseOrderItemId: faker.datatype.uuid(),
      quantity: parseInt(faker.datatype.number().toString(), 10),
    };

    const expectedPurchaseOrderItem = fakePurchaseOrderItem;
    expectedPurchaseOrderItem.quantity = data.quantity;

    await handler.handle(data);

    expect(sendEventsSpy).toHaveBeenCalledTimes(1);
  });
});
