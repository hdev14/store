import { faker } from '@faker-js/faker';
import PurchaseOrderItemNotDeletedError from '@sales/app/PurchaseOrderItemNotDeletedError.ts';
import RemovePurchaseOrderItemCommand from '@sales/app/commands/RemovePurchaseOrderItemCommand';
import RemovePurchaseOrderItemCommandHandler from '@sales/app/handlers/RemovePurchaseOrderItemCommandHandler';
import RemovePurchaseOrderItemEvent from '@sales/domain/events/RemovePurchaseOrderItemEvent';
import IEventQueue from '@shared/abstractions/IEventQueue';
import { mock } from 'jest-mock-extended';
import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

const eventQueueMock = mock<IEventQueue>();

eventQueueMock.enqueue.mockImplementation(() => Promise.resolve());

describe("RemovePurchaseOrderItemCommandHandler's unit tests", () => {
  it('calls repository.deletePurchaseOrderItem with correct id', async () => {
    expect.assertions(2);

    const deletePurchaseOrderItemSpy = jest.spyOn(repositoryStub, 'deletePurchaseOrderItem');

    const handler = new RemovePurchaseOrderItemCommandHandler(repositoryStub, eventQueueMock);

    const command = new RemovePurchaseOrderItemCommand(faker.datatype.uuid());

    await handler.handle(command);

    expect(deletePurchaseOrderItemSpy).toHaveBeenCalledTimes(1);
    expect(deletePurchaseOrderItemSpy).toHaveBeenCalledWith(command.purchase_order_item_id);
  });

  it('throws a PurchaseOrderItemNotDeletedError if purchase order item was not deleted', async () => {
    expect.assertions(2);

    repositoryStub.deletePurchaseOrderItem = jest.fn().mockRejectedValueOnce(new Error('test'));

    const handler = new RemovePurchaseOrderItemCommandHandler(repositoryStub, eventQueueMock);

    const command = new RemovePurchaseOrderItemCommand(faker.datatype.uuid());

    return handler.handle(command).catch((e: any) => {
      expect(e).toBeInstanceOf(PurchaseOrderItemNotDeletedError);
      expect(e.message).toEqual('Não foi possível excluir o item.');
    });
  });

  it('calls Queue.enqueue with RemovePurchaseOrderItemEvent after purchase order item was deleted', async () => {
    expect.assertions(1);

    const handler = new RemovePurchaseOrderItemCommandHandler(repositoryStub, eventQueueMock);

    const command = new RemovePurchaseOrderItemCommand(faker.datatype.uuid());

    await handler.handle(command);

    expect(eventQueueMock.enqueue.mock.calls[0][0]).toBeInstanceOf(RemovePurchaseOrderItemEvent);
  });

  it("doesn't throw a Error if EventQueue.enqueue throws a QueueError", async () => {
    expect.assertions(1);

    eventQueueMock.enqueue.mockRejectedValueOnce(new Error('test'));

    const handler = new RemovePurchaseOrderItemCommandHandler(repositoryStub, eventQueueMock);

    const command = new RemovePurchaseOrderItemCommand(faker.datatype.uuid());

    expect(async () => handler.handle(command)).not.toThrow();
  });
});
