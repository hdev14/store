import { faker } from '@faker-js/faker';
import { AddPurchaseOrderItemData } from '@sales/app/AddPurchaseOrderItemCommand';
import AddPurchaseOrderItemCommandHandler from '@sales/app/AddPurchaseOrderItemCommandHandler';
import { EventData } from '@shared/@types/events';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import RepositoryStub from '../../stubs/PurchaseOrderRepositoryStub';
import createGenerateIDMock from '../../stubs/createGenerateIDMock';

jest.mock('../../../../src/store/sales/domain/PurchaseOrderItem');
const PurchaseOrderItemMock = jest.mocked(PurchaseOrderItem, true);

beforeEach(() => {
  PurchaseOrderItemMock.mockClear();
});

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
    );

    await addPurchaseOrderItemCommandHandler.handle(data);

    expect(getDraftPurchaseOrderByClientIdSpy).toHaveBeenCalledTimes(1);
    expect(getDraftPurchaseOrderByClientIdSpy).toHaveBeenCalledWith(data.clientId);
  });

  it('creates a new PurchaseOrderItem', async () => {
    expect.assertions(6);

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

    const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(
      repository,
      createGenerateIDMock(),
    );

    await addPurchaseOrderItemCommandHandler.handle(data);

    expect(PurchaseOrderItemMock).toHaveBeenCalledTimes(1);
    expect(PurchaseOrderItemMock.mock.calls[0][0].id).toEqual(data.principalId);
    expect(PurchaseOrderItemMock.mock.calls[0][0].quantity).toEqual(data.quantity);
    expect(PurchaseOrderItemMock.mock.calls[0][0].product.id).toEqual(data.productId);
    expect(PurchaseOrderItemMock.mock.calls[0][0].product.name).toEqual(data.productName);
    expect(PurchaseOrderItemMock.mock.calls[0][0].product.amount).toEqual(data.productAmount);
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
});
