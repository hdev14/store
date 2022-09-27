import { faker } from '@faker-js/faker';
import { UpdatePurchaseOrderItemQuantityCommandData } from '@sales/app/commands/UpdatePurchaseOrderItemQuantityCommand';
import UpdatePurchaseOrderItemQuantityCommandHandler from '@sales/app/commands/UpdatePurchaseOrderItemQuantityCommandHandler';
import Product from '@sales/domain/Product';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import { EventData } from '@shared/@types/events';
import RepositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

describe("UpdatePurchaseOrderItemQuantityCommandHandler's unit test", () => {
  it('calls repository.getPurchaseOrderItemById', async () => {
    expect.assertions(2);

    const repository = new RepositoryStub();
    const getPurchaseOrderItemByIdSpy = jest.spyOn(repository, 'getPurchaseOrderItemById');

    const handler = new UpdatePurchaseOrderItemQuantityCommandHandler(repository);

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

    const handler = new UpdatePurchaseOrderItemQuantityCommandHandler(repository);

    const data: EventData<UpdatePurchaseOrderItemQuantityCommandData> = {
      principalId: faker.datatype.uuid(),
      quantity: parseInt(faker.datatype.number().toString(), 10),
      timestamp: new Date().toISOString(),
    };

    const result = await handler.handle(data);

    expect(result).toBe(false);
  });

  it('calls repository.updatePurchaseOrderItem if found the item', async () => {
    expect.assertions(2);

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

    const handler = new UpdatePurchaseOrderItemQuantityCommandHandler(repository);

    const data: EventData<UpdatePurchaseOrderItemQuantityCommandData> = {
      principalId: faker.datatype.uuid(),
      quantity: parseInt(faker.datatype.number().toString(), 10),
      timestamp: new Date().toISOString(),
    };

    const expectedPurchaseOrderItem = fakePurchaseOrderItem;
    expectedPurchaseOrderItem.quantity = data.quantity;

    await handler.handle(data);

    expect(updatePurchaseOrderItemSpy).toHaveBeenCalledTimes(1);
    expect(updatePurchaseOrderItemSpy).toHaveBeenCalledWith(expectedPurchaseOrderItem);
  });
});
