import { faker } from '@faker-js/faker';
import RemovePurchaseOrderItemEventHandler from '@sales/app/handlers/RemovePurchaseOrderItemEventHandler';
import RemovePurchaseOrderItemEvent from '@sales/domain/events/RemovePurchaseOrderItemEvent';
import EventHandlerError from '@shared/errors/EventHandlerError';
import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

describe("RemovePurchaseOrderItemEventHandler's unit tests", () => {
  it('calls repository.deletePurchaseOrderItem with correct params', async () => {
    expect.assertions(1);

    const deletePurchaseOrderItemSpy = jest.spyOn(repositoryStub, 'deletePurchaseOrderItem');

    const handler = new RemovePurchaseOrderItemEventHandler(repositoryStub);

    const event = new RemovePurchaseOrderItemEvent(faker.datatype.uuid());

    await handler.handle(event);

    expect(deletePurchaseOrderItemSpy).toHaveBeenCalledWith(event.principalId);
  });

  it('throws a EventHandlerError if occurs an expected error', async () => {
    expect.assertions(2);

    repositoryStub.deletePurchaseOrderItem = jest.fn().mockRejectedValueOnce(new Error('test'));

    const handler = new RemovePurchaseOrderItemEventHandler(repositoryStub);

    const event = new RemovePurchaseOrderItemEvent(faker.datatype.uuid());

    try {
      await handler.handle(event);
    } catch (e: any) {
      expect(e).toBeInstanceOf(EventHandlerError);
      expect(e.message).toEqual('Erro ao excluir um item.');
    }
  });
});
