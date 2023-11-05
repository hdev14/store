import { faker } from '@faker-js/faker';
import PurchaseOrderItemNotFoundError from '@sales/app/PurchaseOrderItemNotFoundError';
import UpdatePurchaseOrderItemQuantityCommand from '@sales/app/commands/UpdatePurchaseOrderItemQuantityCommand';
import UpdatePurchaseOrderItemQuantityCommandHandler from '@sales/app/handlers/UpdatePurchaseOrderItemQuantityCommandHandler';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import UpdatePurchaseOrderItemEvent from '@sales/domain/events/UpdatePurchaseOrderItemEvent';
import IEventQueue from '@shared/abstractions/IEventQueue';
import { mock } from 'jest-mock-extended';
import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

const eventQueueMock = mock<IEventQueue>();

eventQueueMock.enqueue.mockImplementation(() => Promise.resolve());

describe("UpdatePurchaseOrderItemQuantityCommandHandler's unit test", () => {
  it('calls repositoryStub.getPurchaseOrderItemById', async () => {
    expect.assertions(2);

    const getPurchaseOrderItemByIdSpy = jest.spyOn(repositoryStub, 'getPurchaseOrderItemById');

    const handler = new UpdatePurchaseOrderItemQuantityCommandHandler(
      repositoryStub,
      eventQueueMock,
    );

    const command = new UpdatePurchaseOrderItemQuantityCommand(
      faker.datatype.uuid(),
      parseInt(faker.datatype.number().toString(), 10),
    );

    await handler.handle(command);

    expect(getPurchaseOrderItemByIdSpy).toHaveBeenCalledTimes(1);
    expect(getPurchaseOrderItemByIdSpy).toHaveBeenCalledWith(command.purchase_order_item_id);
  });

  it("return PurchaseOrderItemNotFoundError if purchase order item doesn't exist", async () => {
    expect.assertions(2);

    repositoryStub.getPurchaseOrderItemById = jest.fn().mockResolvedValueOnce(null);

    const handler = new UpdatePurchaseOrderItemQuantityCommandHandler(
      repositoryStub,
      eventQueueMock,
    );

    const command = new UpdatePurchaseOrderItemQuantityCommand(
      faker.datatype.uuid(),
      parseInt(faker.datatype.number().toString(), 10),
    );

    return handler.handle(command).catch((e: any) => {
      expect(e).toBeInstanceOf(PurchaseOrderItemNotFoundError);
      expect(e.message).toEqual('Item não encontrado.');
    });
  });

  it('calls repository.updatePurchaseOrderItem if found the item', async () => {
    expect.assertions(2);

    const fakePurchaseOrderItem = new PurchaseOrderItem({
      id: faker.datatype.uuid(),
      quantity: parseInt(faker.datatype.number().toString(), 10),
      purchase_order_id: faker.datatype.uuid(),
      product: {
        id: faker.datatype.uuid(),
        name: faker.commerce.product(),
        amount: faker.datatype.float(),
      },
    });

    repositoryStub.getPurchaseOrderItemById = jest.fn()
      .mockResolvedValueOnce(fakePurchaseOrderItem);

    const updatePurchaseOrderItemSpy = jest.spyOn(repositoryStub, 'updatePurchaseOrderItem');

    const handler = new UpdatePurchaseOrderItemQuantityCommandHandler(
      repositoryStub,
      eventQueueMock,
    );

    const command = new UpdatePurchaseOrderItemQuantityCommand(
      faker.datatype.uuid(),
      parseInt(faker.datatype.number().toString(), 10),
    );

    const expectedPurchaseOrderItem = fakePurchaseOrderItem;
    expectedPurchaseOrderItem.quantity = command.quantity;

    await handler.handle(command);

    expect(updatePurchaseOrderItemSpy).toHaveBeenCalledTimes(1);
    expect(updatePurchaseOrderItemSpy).toHaveBeenCalledWith(expectedPurchaseOrderItem);
  });

  it('calls EventQueue.enqueue with UpdatePurchaseOrderItemEvent after updating the purchase order item', async () => {
    expect.assertions(1);

    const fakePurchaseOrderItem = new PurchaseOrderItem({
      id: faker.datatype.uuid(),
      quantity: parseInt(faker.datatype.number().toString(), 10),
      purchase_order_id: faker.datatype.uuid(),
      product: {
        id: faker.datatype.uuid(),
        name: faker.commerce.product(),
        amount: faker.datatype.float(),
      },
    });

    repositoryStub.getPurchaseOrderItemById = jest.fn()
      .mockResolvedValueOnce(fakePurchaseOrderItem);

    const handler = new UpdatePurchaseOrderItemQuantityCommandHandler(
      repositoryStub,
      eventQueueMock,
    );

    const command = new UpdatePurchaseOrderItemQuantityCommand(
      faker.datatype.uuid(),
      parseInt(faker.datatype.number().toString(), 10),
    );

    await handler.handle(command);

    expect(eventQueueMock.enqueue.mock.calls[0][0]).toBeInstanceOf(UpdatePurchaseOrderItemEvent);
  });

  it("doesn't throw a Error if EventQueue.enqueue throws a QueueError", async () => {
    expect.assertions(1);

    const fakePurchaseOrderItem = new PurchaseOrderItem({
      id: faker.datatype.uuid(),
      quantity: parseInt(faker.datatype.number().toString(), 10),
      purchase_order_id: faker.datatype.uuid(),
      product: {
        id: faker.datatype.uuid(),
        name: faker.commerce.product(),
        amount: faker.datatype.float(),
      },
    });

    repositoryStub.getPurchaseOrderItemById = jest.fn()
      .mockResolvedValueOnce(fakePurchaseOrderItem);

    const handler = new UpdatePurchaseOrderItemQuantityCommandHandler(
      repositoryStub,
      eventQueueMock,
    );

    const command = new UpdatePurchaseOrderItemQuantityCommand(
      faker.datatype.uuid(),
      parseInt(faker.datatype.number().toString(), 10),
    );

    expect(async () => handler.handle(command)).not.toThrow();
  });
});
