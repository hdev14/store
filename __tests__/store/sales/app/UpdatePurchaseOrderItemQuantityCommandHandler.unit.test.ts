import { faker } from '@faker-js/faker';
import UpdatePurchaseOrderItemQuantityCommand from '@sales/app/commands/UpdatePurchaseOrderItemQuantityCommand';
import UpdatePurchaseOrderItemQuantityCommandHandler from '@sales/app/handlers/UpdatePurchaseOrderItemQuantityCommandHandler';
import Product from '@sales/domain/Product';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import PurchaseOrderItemNotFoundError from '@sales/app/PurchaseOrderItemNotFoundError';
import { mock } from 'jest-mock-extended';
import IEventQueue from '@shared/abstractions/IEventQueue';
import UpdatePurchaseOrderItemEvent from '@sales/domain/events/UpdatePurchaseOrderItemEvent';
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
    expect(getPurchaseOrderItemByIdSpy).toHaveBeenCalledWith(command.purchaseOrderItemId);
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

    try {
      await handler.handle(command);
    } catch (e: any) {
      expect(e).toBeInstanceOf(PurchaseOrderItemNotFoundError);
      expect(e.message).toEqual('Item não encontrado.');
    }
  });

  it('calls repository.updatePurchaseOrderItem if found the item', async () => {
    expect.assertions(2);

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
      purchaseOrderId: faker.datatype.uuid(),
      product: new Product(
        faker.datatype.uuid(),
        faker.commerce.product(),
        faker.datatype.float(),
      ),
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
      purchaseOrderId: faker.datatype.uuid(),
      product: new Product(
        faker.datatype.uuid(),
        faker.commerce.product(),
        faker.datatype.float(),
      ),
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
