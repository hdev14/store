import { faker } from '@faker-js/faker';
import AddPurchaseOrderItemCommand from '@sales/app/commands/AddPurchaseOrderItemCommand';
import AddPurchaseOrderItemCommandHandler from '@sales/app/handlers/AddPurchaseOrderItemCommandHandler';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import AddDraftPurchaseOrderEvent from '@sales/domain/events/AddDraftPurchaseOrderEvent';
import AddPurchaseOrderItemEvent from '@sales/domain/events/AddPurchaseOrderItemEvent';
import UpdateDraftPurchaseOrderEvent from '@sales/domain/events/UpdateDraftPurchaseOrderEvent';
import UpdatePurchaseOrderItemEvent from '@sales/domain/events/UpdatePurchaseOrderItemEvent';
import IEventQueue from '@shared/abstractions/IEventQueue';
import { mock, mockClear } from 'jest-mock-extended';
import { RepositoryStub } from '../../stubs/PurchaseOrderRepositoryStub';

const eventQueueMock = mock<IEventQueue>();

beforeEach(() => {
  mockClear(eventQueueMock);

  eventQueueMock.enqueue.mockImplementation(() => Promise.resolve());
  eventQueueMock.enqueueInBatch.mockImplementation(() => Promise.resolve());
  eventQueueMock.closeConnection.mockImplementation(() => Promise.resolve());
});

describe("AddPurchaseOrderItemCommandHandler's unit tests", () => {
  it('calls repository.getDraftPurchaseOrderByCustomerId with correct customerId', async () => {
    expect.assertions(2);

    const repository = new RepositoryStub();
    const getDraftPurchaseOrderByCustomerIdSpy = jest.spyOn(repository, 'getDraftPurchaseOrderByCustomerId');

    const command = new AddPurchaseOrderItemCommand(
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      faker.commerce.product(),
      faker.datatype.float(),
      1,
    );

    const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(
      repository,
      eventQueueMock,
    );

    await addPurchaseOrderItemCommandHandler.handle(command);

    expect(getDraftPurchaseOrderByCustomerIdSpy).toHaveBeenCalledTimes(1);
    expect(getDraftPurchaseOrderByCustomerIdSpy).toHaveBeenCalledWith(command.customer_id);
  });

  it("calls repository.countPurchaseOrders if draftPurchaseOrder doesn't exist", async () => {
    expect.assertions(1);

    const repository = new RepositoryStub();
    repository.getDraftPurchaseOrderByCustomerId = jest.fn().mockResolvedValueOnce(null);
    const countPurchaseOrdersSpy = jest.spyOn(repository, 'countPurchaseOrders');

    const command = new AddPurchaseOrderItemCommand(
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      faker.commerce.product(),
      faker.datatype.float(),
      1,
    );

    const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(
      repository,
      eventQueueMock,
    );

    await addPurchaseOrderItemCommandHandler.handle(command);

    expect(countPurchaseOrdersSpy).toHaveBeenCalledTimes(1);
  });

  it("creates a new DraftPurchaseOrder if draftPurchaseOrder doesn't exist", async () => {
    expect.assertions(8);

    const repository = new RepositoryStub();
    repository.getDraftPurchaseOrderByCustomerId = jest.fn().mockResolvedValueOnce(null);

    const createDraftSpy = jest.spyOn(PurchaseOrder, 'createDraft');

    const command = new AddPurchaseOrderItemCommand(
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      faker.commerce.product(),
      faker.datatype.float(),
      1,
    );

    const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(
      repository,
      eventQueueMock,
    );

    await addPurchaseOrderItemCommandHandler.handle(command);

    expect(createDraftSpy).toHaveBeenCalledTimes(1);
    expect(createDraftSpy.mock.calls[0][0].id).toBeTruthy();
    expect(createDraftSpy.mock.calls[0][0].customer_id).toEqual(command.customer_id);
    expect(createDraftSpy.mock.calls[0][0].code).toBeTruthy();
    expect(createDraftSpy.mock.calls[0][0].voucher).toBeNull();
    expect(createDraftSpy.mock.calls[0][0].status).toBeNull();
    expect(createDraftSpy.mock.calls[0][0].code).toBeTruthy();
    expect(createDraftSpy.mock.calls[0][0].created_at instanceof Date).toBe(true);
  });

  it('adds a new PurchaseOrderItem in the new draftPurchaseOrder', async () => {
    expect.assertions(1);

    const repository = new RepositoryStub();
    repository.getDraftPurchaseOrderByCustomerId = jest.fn().mockResolvedValueOnce(null);

    const addItemMock = jest.fn();
    jest.spyOn(PurchaseOrder, 'createDraft').mockReturnValueOnce({ addItem: addItemMock } as any);

    const command = new AddPurchaseOrderItemCommand(
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      faker.commerce.product(),
      faker.datatype.float(),
      1,
    );

    const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(
      repository,
      eventQueueMock,
    );

    await addPurchaseOrderItemCommandHandler.handle(command);

    expect(addItemMock).toHaveBeenCalledTimes(1);
  });

  it('calls repository.addPurchaseOrder after add the purchase order item in the new draftPurchaseOrder', async () => {
    expect.assertions(1);

    const repository = new RepositoryStub();
    repository.getDraftPurchaseOrderByCustomerId = jest.fn().mockResolvedValueOnce(null);
    const addPurchaseOrderSpy = jest.spyOn(repository, 'addPurchaseOrder');

    const command = new AddPurchaseOrderItemCommand(
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      faker.commerce.product(),
      faker.datatype.float(),
      1,
    );

    const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(
      repository,
      eventQueueMock,
    );

    await addPurchaseOrderItemCommandHandler.handle(command);

    expect(addPurchaseOrderSpy).toHaveBeenCalledTimes(1);
  });

  it('calls repository.addPurchaseOrderItem after add the purchase order item in the new draftPurchaseOrder', async () => {
    expect.assertions(1);

    const repository = new RepositoryStub();
    repository.getDraftPurchaseOrderByCustomerId = jest.fn().mockResolvedValueOnce(null);
    const addPurchaseOrderItemSpy = jest.spyOn(repository, 'addPurchaseOrderItem');

    const command = new AddPurchaseOrderItemCommand(
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      faker.commerce.product(),
      faker.datatype.float(),
      1,
    );

    const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(
      repository,
      eventQueueMock,
    );

    await addPurchaseOrderItemCommandHandler.handle(command);

    expect(addPurchaseOrderItemSpy).toHaveBeenCalledTimes(1);
  });

  it('calls repository.updatePurchaseOrderItem if draftPurchaseOrder exists and have the same item', async () => {
    expect.assertions(1);

    const repository = new RepositoryStub();

    const command = new AddPurchaseOrderItemCommand(
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      faker.commerce.product(),
      faker.datatype.float(),
      1,
    );

    const purchaseOrderItem = new PurchaseOrderItem({
      id: faker.datatype.uuid(),
      quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
      product: {
        id: command.product_id,
        name: command.product_name,
        amount: command.product_amount,
      },
    });

    const purchaseOrder = new PurchaseOrder({
      id: faker.datatype.uuid(),
      customer_id: faker.datatype.uuid(),
      code: parseInt(faker.datatype.number().toString(), 10),
      created_at: new Date(),
      voucher: null,
      status: null,
      items: [],
    });

    purchaseOrder.addItem(purchaseOrderItem);

    repository.getDraftPurchaseOrderByCustomerId = jest.fn().mockResolvedValueOnce(purchaseOrder);

    const updatePurchaseOrderItemSpy = jest.spyOn(repository, 'updatePurchaseOrderItem');

    const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(
      repository,
      eventQueueMock,
    );

    await addPurchaseOrderItemCommandHandler.handle(command);

    expect(updatePurchaseOrderItemSpy).toHaveBeenCalledTimes(1);
  });

  it("calls repository.addPurchaseOrderItem if draftPurchaseOrder exists and don't have the same item", async () => {
    expect.assertions(1);

    const repository = new RepositoryStub();

    const command = new AddPurchaseOrderItemCommand(
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      faker.commerce.product(),
      faker.datatype.float(),
      1,
    );

    const purchaseOrder = new PurchaseOrder({
      id: faker.datatype.uuid(),
      customer_id: faker.datatype.uuid(),
      code: parseInt(faker.datatype.number().toString(), 10),
      created_at: new Date(),
      voucher: null,
      status: null,
      items: [],
    });

    repository.getDraftPurchaseOrderByCustomerId = jest.fn().mockResolvedValueOnce(purchaseOrder);

    const addPurchaseOrderItemSpy = jest.spyOn(repository, 'addPurchaseOrderItem');

    const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(
      repository,
      eventQueueMock,
    );

    await addPurchaseOrderItemCommandHandler.handle(command);

    expect(addPurchaseOrderItemSpy).toHaveBeenCalledTimes(1);
  });

  it('calls repository.updatePurchaseOrder if draftPurchaseOrder already exists', async () => {
    expect.assertions(1);

    const repository = new RepositoryStub();

    const command = new AddPurchaseOrderItemCommand(
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      faker.commerce.product(),
      faker.datatype.float(),
      1,
    );

    const purchaseOrder = new PurchaseOrder({
      id: faker.datatype.uuid(),
      customer_id: faker.datatype.uuid(),
      code: parseInt(faker.datatype.number().toString(), 10),
      created_at: new Date(),
      voucher: null,
      status: null,
      items: [],
    });

    repository.getDraftPurchaseOrderByCustomerId = jest.fn().mockResolvedValueOnce(purchaseOrder);

    const updatePurchaseOrderSpy = jest.spyOn(repository, 'updatePurchaseOrder');

    const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(
      repository,
      eventQueueMock,
    );

    await addPurchaseOrderItemCommandHandler.handle(command);

    expect(updatePurchaseOrderSpy).toHaveBeenCalledTimes(1);
  });

  it('calls Queue.enqueueInBatch with AddDraftPurchaseOrderEvent and AddPurchaseOrderItemEvent after complete the operation of adding the purchase order item', async () => {
    expect.assertions(2);

    const repository = new RepositoryStub();

    repository.getDraftPurchaseOrderByCustomerId = jest.fn().mockResolvedValueOnce(null);

    const command = new AddPurchaseOrderItemCommand(
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      faker.commerce.product(),
      faker.datatype.float(),
      1,
    );

    const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(
      repository,
      eventQueueMock,
    );

    await addPurchaseOrderItemCommandHandler.handle(command);

    const events = eventQueueMock.enqueueInBatch.mock.calls[0][0];

    expect(events[0]).toBeInstanceOf(AddDraftPurchaseOrderEvent);
    expect(events[1]).toBeInstanceOf(AddPurchaseOrderItemEvent);
  });

  it("doesn't throw a Error if Queue.enqueue method throws a QueueError when it is adding the AddDraftPurchaseOrderEvent", async () => {
    expect.assertions(1);

    const repository = new RepositoryStub();

    repository.getDraftPurchaseOrderByCustomerId = jest.fn().mockResolvedValueOnce(null);
    eventQueueMock.enqueueInBatch.mockRejectedValueOnce(new Error('test'));

    const command = new AddPurchaseOrderItemCommand(
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      faker.commerce.product(),
      faker.datatype.float(),
      1,
    );

    const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(
      repository,
      eventQueueMock,
    );

    expect(
      async () => addPurchaseOrderItemCommandHandler.handle(command),
    ).not.toThrow();
  });

  it('calls Queue.enqueue with AddPurchaseOrderItemEvent after check the purchase order item exists', async () => {
    expect.assertions(1);

    const repository = new RepositoryStub();

    const command = new AddPurchaseOrderItemCommand(
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      faker.commerce.product(),
      faker.datatype.float(),
      1,
    );

    const purchaseOrderItem = new PurchaseOrderItem({
      id: faker.datatype.uuid(),
      quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
      product: {
        id: command.product_id,
        name: command.product_name,
        amount: command.product_amount,
      },
    });

    const purchaseOrder = new PurchaseOrder({
      id: faker.datatype.uuid(),
      customer_id: faker.datatype.uuid(),
      code: parseInt(faker.datatype.number().toString(), 10),
      created_at: new Date(),
      voucher: null,
      status: null,
      items: [],
    });

    purchaseOrder.addItem(purchaseOrderItem);

    repository.getDraftPurchaseOrderByCustomerId = jest.fn().mockResolvedValueOnce(purchaseOrder);

    const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(
      repository,
      eventQueueMock,
    );

    await addPurchaseOrderItemCommandHandler.handle(command);

    expect(eventQueueMock.enqueue.mock.calls[0][0]).toBeInstanceOf(UpdatePurchaseOrderItemEvent);
  });

  it("doesn't throw a Error if Queue.enqueue method throws a QueueError when it is adding the AddPurchaseOrderItemEvent", async () => {
    expect.assertions(1);

    const repository = new RepositoryStub();

    const command = new AddPurchaseOrderItemCommand(
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      faker.commerce.product(),
      faker.datatype.float(),
      1,
    );

    const purchaseOrderItem = new PurchaseOrderItem({
      id: faker.datatype.uuid(),
      quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
      product: {
        id: command.product_id,
        name: command.product_name,
        amount: command.product_amount,
      },
    });

    const purchaseOrder = new PurchaseOrder({
      id: faker.datatype.uuid(),
      customer_id: faker.datatype.uuid(),
      code: parseInt(faker.datatype.number().toString(), 10),
      created_at: new Date(),
      voucher: null,
      status: null,
      items: [],
    });

    purchaseOrder.addItem(purchaseOrderItem);

    repository.getDraftPurchaseOrderByCustomerId = jest.fn().mockResolvedValueOnce(purchaseOrder);

    eventQueueMock.enqueue.mockRejectedValueOnce(new Error('test'));

    const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(
      repository,
      eventQueueMock,
    );

    expect(async () => addPurchaseOrderItemCommandHandler.handle(command)).not.toThrow();
  });

  it("calls Queue.enqueue with AddPurchaseOrderItemEvent after check if purchase order item doesn't exist", async () => {
    expect.assertions(1);

    const repository = new RepositoryStub();

    const command = new AddPurchaseOrderItemCommand(
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      faker.commerce.product(),
      faker.datatype.float(),
      1,
    );

    const purchaseOrder = new PurchaseOrder({
      id: faker.datatype.uuid(),
      customer_id: faker.datatype.uuid(),
      code: parseInt(faker.datatype.number().toString(), 10),
      created_at: new Date(),
      voucher: null,
      status: null,
      items: [],
    });

    repository.getDraftPurchaseOrderByCustomerId = jest.fn().mockResolvedValueOnce(purchaseOrder);

    const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(
      repository,
      eventQueueMock,
    );

    await addPurchaseOrderItemCommandHandler.handle(command);

    expect(eventQueueMock.enqueue.mock.calls[0][0]).toBeInstanceOf(AddPurchaseOrderItemEvent);
  });

  it("doesn't throw a Error if Queue.enqueue method throws a QueueError when it is adding the AddPurchaseOrderItemEvent", async () => {
    expect.assertions(1);

    const repository = new RepositoryStub();

    const command = new AddPurchaseOrderItemCommand(
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      faker.commerce.product(),
      faker.datatype.float(),
      1,
    );

    const purchaseOrder = new PurchaseOrder({
      id: faker.datatype.uuid(),
      customer_id: faker.datatype.uuid(),
      code: parseInt(faker.datatype.number().toString(), 10),
      created_at: new Date(),
      voucher: null,
      status: null,
      items: [],
    });

    repository.getDraftPurchaseOrderByCustomerId = jest.fn().mockResolvedValueOnce(purchaseOrder);
    eventQueueMock.enqueue.mockRejectedValueOnce(new Error('test'));

    const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(
      repository,
      eventQueueMock,
    );

    expect(async () => addPurchaseOrderItemCommandHandler.handle(command)).not.toThrow();
  });

  it('calls Queue.enqueue with UpdateDraftPurchaseOrderEvent after complete the operation of update the draft purchase order', async () => {
    expect.assertions(1);

    const repository = new RepositoryStub();

    const command = new AddPurchaseOrderItemCommand(
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      faker.commerce.product(),
      faker.datatype.float(),
      1,
    );

    const purchaseOrder = new PurchaseOrder({
      id: faker.datatype.uuid(),
      customer_id: faker.datatype.uuid(),
      code: parseInt(faker.datatype.number().toString(), 10),
      created_at: new Date(),
      voucher: null,
      status: null,
      items: [],
    });

    repository.getDraftPurchaseOrderByCustomerId = jest.fn().mockResolvedValueOnce(purchaseOrder);

    const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(
      repository,
      eventQueueMock,
    );

    await addPurchaseOrderItemCommandHandler.handle(command);

    expect(eventQueueMock.enqueue.mock.calls[1][0]).toBeInstanceOf(UpdateDraftPurchaseOrderEvent);
  });

  it("doesn't throw a Error if Queue.enqueue method throws a QueueError when it is updating the draft purchase order", async () => {
    expect.assertions(1);

    const repository = new RepositoryStub();

    const command = new AddPurchaseOrderItemCommand(
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      faker.commerce.product(),
      faker.datatype.float(),
      1,
    );

    const purchaseOrder = new PurchaseOrder({
      id: faker.datatype.uuid(),
      customer_id: faker.datatype.uuid(),
      code: parseInt(faker.datatype.number().toString(), 10),
      created_at: new Date(),
      voucher: null,
      status: null,
      items: [],
    });

    repository.getDraftPurchaseOrderByCustomerId = jest.fn().mockResolvedValueOnce(purchaseOrder);
    eventQueueMock.enqueue
      .mockRejectedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('test'));

    const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(
      repository,
      eventQueueMock,
    );

    expect(async () => addPurchaseOrderItemCommandHandler.handle(command)).not.toThrow();
  });
});
