import { faker } from '@faker-js/faker';
import { RemovePurchaseOrderItemCommandData } from '@sales/app/commands/RemovePurchaseOrderItemCommand';
import RemovePurchaseOrderItemCommandHandler from '@sales/app/commands/RemovePurchaseOrderItemCommandHandler';
import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

describe("RemovePurchaseOrderItemCommandHandler's unit tests", () => {
  it('calls repository.deletePurchaseOrderItem with correct id', async () => {
    expect.assertions(2);

    const deletePurchaseOrderItemSpy = jest.spyOn(repositoryStub, 'deletePurchaseOrderItem');

    const handler = new RemovePurchaseOrderItemCommandHandler(repositoryStub);

    const data: RemovePurchaseOrderItemCommandData = {
      purchaseOrderItemId: faker.datatype.uuid(),
    };

    await handler.handle(data);

    expect(deletePurchaseOrderItemSpy).toHaveBeenCalledTimes(1);
    expect(deletePurchaseOrderItemSpy).toHaveBeenCalledWith(data.purchaseOrderItemId);
  });

  it('returns TRUE after remove purchase order item', async () => {
    expect.assertions(1);

    repositoryStub.deletePurchaseOrderItem = jest.fn().mockResolvedValueOnce(true);

    const handler = new RemovePurchaseOrderItemCommandHandler(repositoryStub);

    const data: RemovePurchaseOrderItemCommandData = {
      purchaseOrderItemId: faker.datatype.uuid(),
    };

    const result = await handler.handle(data);

    expect(result).toBe(true);
  });

  it('returns FALSE if occurs an expected error', async () => {
    expect.assertions(1);

    repositoryStub.deletePurchaseOrderItem = jest.fn().mockRejectedValueOnce(new Error('test'));

    const handler = new RemovePurchaseOrderItemCommandHandler(repositoryStub);

    const data: RemovePurchaseOrderItemCommandData = {
      purchaseOrderItemId: faker.datatype.uuid(),
    };

    const result = await handler.handle(data);

    expect(result).toBe(false);
  });
});
