import { faker } from '@faker-js/faker';
import PurchaseOrderNotFoundError from '@sales/app/PurchaseOrderNotFoundError';
import StartPurchaseOrderCommand from '@sales/app/commands/StartPurchaseOrderCommand';
import StartPurchaseOrderCommandHandler from '@sales/app/handlers/StartPurchaseOrderCommandHandler';
import PurchaseOrder, { PurchaseOrderStatus } from '@sales/domain/PurchaseOrder';
import UpdatePurchaseOrderEvent from '@sales/domain/events/UpdatePurchaseOrderEvent';
import IEventQueue from '@shared/abstractions/IEventQueue';
import ChargePurchaseOrderEvent from '@shared/events/ChargePurchaseOrderEvent';
import { mock } from 'jest-mock-extended';
import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

const eventQueueMock = mock<IEventQueue>();

eventQueueMock.enqueueInBatch.mockImplementation(() => Promise.resolve());

describe("StartPurchaseOrderCommandHandler's unit tests", () => {
  it('calls repository.getPurchaseOrderById with correct param', async () => {
    expect.assertions(1);

    const getPurchaseOrderByIdSpy = jest.spyOn(repositoryStub, 'getPurchaseOrderById');
    const handler = new StartPurchaseOrderCommandHandler(repositoryStub, eventQueueMock);

    const command = new StartPurchaseOrderCommand(
      faker.datatype.uuid(),
      faker.random.alphaNumeric(),
      3,
    );

    await handler.handle(command);

    expect(getPurchaseOrderByIdSpy).toHaveBeenCalledWith(command.purchase_order_id);
  });

  it("returns PurchaseOrderNotFound if purchase order doesn't exist", () => {
    expect.assertions(2);

    jest.spyOn(repositoryStub, 'getPurchaseOrderById')
      .mockResolvedValueOnce(null);

    const handler = new StartPurchaseOrderCommandHandler(repositoryStub, eventQueueMock);

    const command = new StartPurchaseOrderCommand(
      faker.datatype.uuid(),
      faker.random.alphaNumeric(),
      3,
    );

    return handler.handle(command).catch((e: any) => {
      expect(e).toBeInstanceOf(PurchaseOrderNotFoundError);
      expect(e.message).toEqual('Pedido não encontrado.');
    });
  });

  it('calls PurchaseOrder.start method after found the purchase order by its id', async () => {
    expect.assertions(1);

    const purchaseOrder = new PurchaseOrder({
      id: faker.datatype.uuid(),
      customer_id: faker.datatype.uuid(),
      code: parseInt(faker.datatype.number().toString(), 10),
      created_at: new Date(),
      voucher: null,
      status: null,
      items: [],
    });

    const startSpy = jest.spyOn(purchaseOrder, 'start');

    jest.spyOn(repositoryStub, 'getPurchaseOrderById').mockResolvedValueOnce(purchaseOrder);

    const handler = new StartPurchaseOrderCommandHandler(repositoryStub, eventQueueMock);

    const command = new StartPurchaseOrderCommand(
      faker.datatype.uuid(),
      faker.random.alphaNumeric(),
      3,
    );

    await handler.handle(command);

    expect(startSpy).toHaveBeenCalledTimes(1);
  });

  it('calls repository.updatePurchaseOrder with correct purchase order', async () => {
    expect.assertions(2);

    const purchaseOrder = new PurchaseOrder({
      id: faker.datatype.uuid(),
      customer_id: faker.datatype.uuid(),
      code: parseInt(faker.datatype.number().toString(), 10),
      created_at: new Date(),
      voucher: null,
      status: null,
      items: [],
    });

    jest.spyOn(repositoryStub, 'getPurchaseOrderById').mockResolvedValueOnce(purchaseOrder);
    const updatePurchaseOrderSpy = jest.spyOn(repositoryStub, 'updatePurchaseOrder');

    const handler = new StartPurchaseOrderCommandHandler(repositoryStub, eventQueueMock);

    const command = new StartPurchaseOrderCommand(
      faker.datatype.uuid(),
      faker.random.alphaNumeric(),
      3,
    );

    await handler.handle(command);

    expect(updatePurchaseOrderSpy).toHaveBeenCalled();
    expect(updatePurchaseOrderSpy.mock.calls[0][0].status).toBe(PurchaseOrderStatus.STARTED);
  });

  it('calls EventQueue.enqueueInBatch with ChargePurchaseOrderEvent and UpdatePurchaseOrderEvent after updating the purchase order', async () => {
    expect.assertions(2);

    const purchaseOrder = new PurchaseOrder({
      id: faker.datatype.uuid(),
      customer_id: faker.datatype.uuid(),
      code: parseInt(faker.datatype.number().toString(), 10),
      created_at: new Date(),
      voucher: null,
      status: null,
      items: [],
    });

    jest.spyOn(repositoryStub, 'getPurchaseOrderById').mockResolvedValueOnce(purchaseOrder);

    const handler = new StartPurchaseOrderCommandHandler(repositoryStub, eventQueueMock);

    const command = new StartPurchaseOrderCommand(
      faker.datatype.uuid(),
      faker.random.alphaNumeric(),
      3,
    );

    await handler.handle(command);

    const events = eventQueueMock.enqueueInBatch.mock.calls[0][0];

    expect(events[0]).toBeInstanceOf(ChargePurchaseOrderEvent);
    expect(events[1]).toBeInstanceOf(UpdatePurchaseOrderEvent);
  });

  it("doesn't throw a Error if EventQueue.enqueueInBatch throws a QueueError when it is called", async () => {
    expect.assertions(1);

    const purchaseOrder = new PurchaseOrder({
      id: faker.datatype.uuid(),
      customer_id: faker.datatype.uuid(),
      code: parseInt(faker.datatype.number().toString(), 10),
      created_at: new Date(),
      voucher: null,
      status: null,
      items: [],
    });

    jest.spyOn(repositoryStub, 'getPurchaseOrderById').mockResolvedValueOnce(purchaseOrder);

    eventQueueMock.enqueueInBatch.mockRejectedValueOnce(new Error('test'));

    const handler = new StartPurchaseOrderCommandHandler(repositoryStub, eventQueueMock);

    const command = new StartPurchaseOrderCommand(
      faker.datatype.uuid(),
      faker.random.alphaNumeric(),
      3,
    );

    expect(async () => handler.handle(command)).not.toThrow();
  });
});
