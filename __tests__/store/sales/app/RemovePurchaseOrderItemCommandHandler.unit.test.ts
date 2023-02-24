import { faker } from '@faker-js/faker';
import RemovePurchaseOrderItemCommand from '@sales/app/commands/RemovePurchaseOrderItemCommand';
import RemovePurchaseOrderItemCommandHandler from '@sales/app/commands/RemovePurchaseOrderItemCommandHandler';
import PurchaseOrderItemNotDeletedError from '@sales/app/PurchaseOrderItemNotDeletedError.ts';
import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

describe("RemovePurchaseOrderItemCommandHandler's unit tests", () => {
  it('calls repository.deletePurchaseOrderItem with correct id', async () => {
    expect.assertions(2);

    const deletePurchaseOrderItemSpy = jest.spyOn(repositoryStub, 'deletePurchaseOrderItem');

    const handler = new RemovePurchaseOrderItemCommandHandler(repositoryStub);

    const command = new RemovePurchaseOrderItemCommand(faker.datatype.uuid());

    await handler.handle(command);

    expect(deletePurchaseOrderItemSpy).toHaveBeenCalledTimes(1);
    expect(deletePurchaseOrderItemSpy).toHaveBeenCalledWith(command.purchaseOrderItemId);
  });

  it('throws a PurchaseOrderItemNotDeletedError if purchase order item was not deleted', async () => {
    expect.assertions(2);

    repositoryStub.deletePurchaseOrderItem = jest.fn().mockRejectedValueOnce(new Error('test'));

    const handler = new RemovePurchaseOrderItemCommandHandler(repositoryStub);

    const command = new RemovePurchaseOrderItemCommand(faker.datatype.uuid());

    try {
      await handler.handle(command);
    } catch (e: any) {
      expect(e).toBeInstanceOf(PurchaseOrderItemNotDeletedError);
      expect(e.message).toEqual('Não foi possível excluir o item.');
    }
  });
});
