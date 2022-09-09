import { faker } from '@faker-js/faker';
import { AddPurchaseOrderItemData } from '@sales/app/AddPurchaseOrderItemCommand';
import AddPurchaseOrderItemCommandHandler from '@sales/app/AddPurchaseOrderItemCommandHandler';
import { EventData } from '@shared/@types/events';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import Product from '@sales/domain/Product';
import EventPublisher from '@shared/EventPublisher';
import { EventConstructor } from '@shared/abstractions/Event';
import EventMediator from '@shared/abstractions/EventMediator';
import createGenerateIDMock from '../../stubs/createGenerateIDMock';
import RepositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

class PublisherStup extends EventPublisher {
  addEvent<T>(ctor: EventConstructor, data: EventData<T>): void {
    console.info(ctor, data);
  }

  sendEvents(): Promise<void> {
    return Promise.resolve();
  }
}

describe("AddPurchaseOrderItemCommandHandler's unit tests", () => {
  it('calls repository.getDraftPurchaseOrderByClientId with correct clientId', async () => {
    expect.assertions(2);

    const repository = new RepositoryStub();
    const getDraftPurchaseOrderByClientIdSpy = jest.spyOn(repository, 'getDraftPurchaseOrderByClientId');

    const data: EventData<AddPurchaseOrderItemData> = {
      principalId: faker.datatype.uuid(),
      clientId: faker.datatype.uuid(),
      productId: faker.datatype.uuid(),
      productName: faker.commerce.product(),
      quantity: 1,
      productAmount: faker.datatype.float(),
      timestamp: new Date().toISOString(),
    };

    const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(
      repository,
      createGenerateIDMock(),
      new PublisherStup({} as EventMediator),
    );

    await addPurchaseOrderItemCommandHandler.handle(data);

    expect(getDraftPurchaseOrderByClientIdSpy).toHaveBeenCalledTimes(1);
    expect(getDraftPurchaseOrderByClientIdSpy).toHaveBeenCalledWith(data.clientId);
  });

  it("calls repository.countPurchaseOrders if draftPurchaseOrder doesn't exist", async () => {
    expect.assertions(1);

    const repository = new RepositoryStub();
    repository.getDraftPurchaseOrderByClientId = jest.fn().mockResolvedValueOnce(null);
    const countPurchaseOrdersSpy = jest.spyOn(repository, 'countPurchaseOrders');

    const data: EventData<AddPurchaseOrderItemData> = {
      principalId: faker.datatype.uuid(),
      clientId: faker.datatype.uuid(),
      productId: faker.datatype.uuid(),
      productName: faker.commerce.product(),
      quantity: 1,
      productAmount: faker.datatype.float(),
      timestamp: new Date().toISOString(),
    };

    const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(
      repository,
      createGenerateIDMock(),
      new PublisherStup({} as EventMediator),
    );

    await addPurchaseOrderItemCommandHandler.handle(data);

    expect(countPurchaseOrdersSpy).toHaveBeenCalledTimes(1);
  });

  it("creates a new DraftPurchaseOrder if draftPurchaseOrder doesn't exist", async () => {
    expect.assertions(8);

    const repository = new RepositoryStub();
    repository.getDraftPurchaseOrderByClientId = jest.fn().mockResolvedValueOnce(null);

    const createDraftSpy = jest.spyOn(PurchaseOrder, 'createDraft');

    const data: EventData<AddPurchaseOrderItemData> = {
      principalId: faker.datatype.uuid(),
      clientId: faker.datatype.uuid(),
      productId: faker.datatype.uuid(),
      productName: faker.commerce.product(),
      quantity: 1,
      productAmount: faker.datatype.float(),
      timestamp: new Date().toISOString(),
    };

    const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(
      repository,
      createGenerateIDMock(),
      new PublisherStup({} as EventMediator),
    );

    await addPurchaseOrderItemCommandHandler.handle(data);

    expect(createDraftSpy).toHaveBeenCalledTimes(1);
    expect(createDraftSpy.mock.calls[0][0].id).toBeTruthy();
    expect(createDraftSpy.mock.calls[0][0].clientId).toEqual(data.clientId);
    expect(createDraftSpy.mock.calls[0][0].code).toBeTruthy();
    expect(createDraftSpy.mock.calls[0][0].voucher).toBeNull();
    expect(createDraftSpy.mock.calls[0][0].status).toBeNull();
    expect(createDraftSpy.mock.calls[0][0].code).toBeTruthy();
    expect(createDraftSpy.mock.calls[0][0].createdAt instanceof Date).toBe(true);
  });

  it('adds a new PurchaseOrderItem in the new draftPurchaseOrder', async () => {
    expect.assertions(1);

    const repository = new RepositoryStub();
    repository.getDraftPurchaseOrderByClientId = jest.fn().mockResolvedValueOnce(null);

    const addItemMock = jest.fn();
    const currentCreateDraft = PurchaseOrder.createDraft;
    PurchaseOrder.createDraft = jest.fn().mockReturnValueOnce({ addItem: addItemMock });

    const data: EventData<AddPurchaseOrderItemData> = {
      principalId: faker.datatype.uuid(),
      clientId: faker.datatype.uuid(),
      productId: faker.datatype.uuid(),
      productName: faker.commerce.product(),
      quantity: 1,
      productAmount: faker.datatype.float(),
      timestamp: new Date().toISOString(),
    };

    const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(
      repository,
      createGenerateIDMock(),
      new PublisherStup({} as EventMediator),
    );

    await addPurchaseOrderItemCommandHandler.handle(data);

    expect(addItemMock).toHaveBeenCalledTimes(1);

    PurchaseOrder.createDraft = currentCreateDraft;
  });

  it('calls repository.addPurchaseOrder after add the purchase order item in the new draftPurchaseOrder', async () => {
    expect.assertions(1);

    const repository = new RepositoryStub();
    repository.getDraftPurchaseOrderByClientId = jest.fn().mockResolvedValueOnce(null);
    const addPurchaseOrderSpy = jest.spyOn(repository, 'addPurchaseOrder');

    const data: EventData<AddPurchaseOrderItemData> = {
      principalId: faker.datatype.uuid(),
      clientId: faker.datatype.uuid(),
      productId: faker.datatype.uuid(),
      productName: faker.commerce.product(),
      quantity: 1,
      productAmount: faker.datatype.float(),
      timestamp: new Date().toISOString(),
    };

    const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(
      repository,
      createGenerateIDMock(),
      new PublisherStup({} as EventMediator),
    );

    await addPurchaseOrderItemCommandHandler.handle(data);

    expect(addPurchaseOrderSpy).toHaveBeenCalledTimes(1);
  });

  it('calls repository.addPurchaseOrderItem after add the purchase order item in the new draftPurchaseOrder', async () => {
    expect.assertions(1);

    const repository = new RepositoryStub();
    repository.getDraftPurchaseOrderByClientId = jest.fn().mockResolvedValueOnce(null);
    const addPurchaseOrderItemSpy = jest.spyOn(repository, 'addPurchaseOrderItem');

    const data: EventData<AddPurchaseOrderItemData> = {
      principalId: faker.datatype.uuid(),
      clientId: faker.datatype.uuid(),
      productId: faker.datatype.uuid(),
      productName: faker.commerce.product(),
      quantity: 1,
      productAmount: faker.datatype.float(),
      timestamp: new Date().toISOString(),
    };

    const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(
      repository,
      createGenerateIDMock(),
      new PublisherStup({} as EventMediator),
    );

    await addPurchaseOrderItemCommandHandler.handle(data);

    expect(addPurchaseOrderItemSpy).toHaveBeenCalledTimes(1);
  });

  it('calls repository.updatePurchaseOrderItem if draftPurchaseOrder exists and have the same item', async () => {
    expect.assertions(1);

    const repository = new RepositoryStub();

    const data: EventData<AddPurchaseOrderItemData> = {
      principalId: faker.datatype.uuid(),
      clientId: faker.datatype.uuid(),
      productId: faker.datatype.uuid(),
      productName: faker.commerce.product(),
      quantity: 1,
      productAmount: faker.datatype.float(),
      timestamp: new Date().toISOString(),
    };

    const purchaseOrderItem = new PurchaseOrderItem({
      id: faker.datatype.uuid(),
      quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
      product: new Product(
        data.productId,
        data.productName,
        data.productAmount,
      ),
    });

    const purchaseOrder = new PurchaseOrder({
      id: faker.datatype.uuid(),
      clientId: faker.datatype.uuid(),
      code: parseInt(faker.datatype.number().toString(), 10),
      createdAt: new Date(),
      voucher: null,
      status: null,
    });

    purchaseOrder.addItem(purchaseOrderItem);

    repository.getDraftPurchaseOrderByClientId = jest.fn().mockResolvedValueOnce(purchaseOrder);

    const updatePurchaseOrderItemSpy = jest.spyOn(repository, 'updatePurchaseOrderItem');

    const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(
      repository,
      createGenerateIDMock(),
      new PublisherStup({} as EventMediator),
    );

    await addPurchaseOrderItemCommandHandler.handle(data);

    expect(updatePurchaseOrderItemSpy).toHaveBeenCalledTimes(1);
  });

  it("calls repository.addPurchaseOrderItem if draftPurchaseOrder exists and don't have the same item", async () => {
    expect.assertions(1);

    const repository = new RepositoryStub();

    const data: EventData<AddPurchaseOrderItemData> = {
      principalId: faker.datatype.uuid(),
      clientId: faker.datatype.uuid(),
      productId: faker.datatype.uuid(),
      productName: faker.commerce.product(),
      quantity: 1,
      productAmount: faker.datatype.float(),
      timestamp: new Date().toISOString(),
    };

    const purchaseOrder = new PurchaseOrder({
      id: faker.datatype.uuid(),
      clientId: faker.datatype.uuid(),
      code: parseInt(faker.datatype.number().toString(), 10),
      createdAt: new Date(),
      voucher: null,
      status: null,
    });

    repository.getDraftPurchaseOrderByClientId = jest.fn().mockResolvedValueOnce(purchaseOrder);

    const addPurchaseOrderItemSpy = jest.spyOn(repository, 'addPurchaseOrderItem');

    const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(
      repository,
      createGenerateIDMock(),
      new PublisherStup({} as EventMediator),
    );

    await addPurchaseOrderItemCommandHandler.handle(data);

    expect(addPurchaseOrderItemSpy).toHaveBeenCalledTimes(1);
  });

  it('calls repository.updatePurchaseOrder if draftPurchaseOrder already exists', async () => {
    expect.assertions(1);

    const repository = new RepositoryStub();

    const data: EventData<AddPurchaseOrderItemData> = {
      principalId: faker.datatype.uuid(),
      clientId: faker.datatype.uuid(),
      productId: faker.datatype.uuid(),
      productName: faker.commerce.product(),
      quantity: 1,
      productAmount: faker.datatype.float(),
      timestamp: new Date().toISOString(),
    };

    const purchaseOrder = new PurchaseOrder({
      id: faker.datatype.uuid(),
      clientId: faker.datatype.uuid(),
      code: parseInt(faker.datatype.number().toString(), 10),
      createdAt: new Date(),
      voucher: null,
      status: null,
    });

    repository.getDraftPurchaseOrderByClientId = jest.fn().mockResolvedValueOnce(purchaseOrder);

    const updatePurchaseOrderSpy = jest.spyOn(repository, 'updatePurchaseOrder');

    const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(
      repository,
      createGenerateIDMock(),
      new PublisherStup({} as EventMediator),
    );

    await addPurchaseOrderItemCommandHandler.handle(data);

    expect(updatePurchaseOrderSpy).toHaveBeenCalledTimes(1);
  });

  it('returns FALSE if occurs an expected error', async () => {
    expect.assertions(1);

    const repository = new RepositoryStub();

    const data: EventData<AddPurchaseOrderItemData> = {
      principalId: faker.datatype.uuid(),
      clientId: faker.datatype.uuid(),
      productId: faker.datatype.uuid(),
      productName: faker.commerce.product(),
      quantity: 1,
      productAmount: faker.datatype.float(),
      timestamp: new Date().toISOString(),
    };

    repository.getDraftPurchaseOrderByClientId = jest.fn().mockRejectedValueOnce(new Error('test'));

    const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(
      repository,
      createGenerateIDMock(),
      new PublisherStup({} as EventMediator),
    );

    const result = await addPurchaseOrderItemCommandHandler.handle(data);

    expect(result).toBe(false);
  });

  // TODO: Add tests to ensures that EventPublisher works
});
