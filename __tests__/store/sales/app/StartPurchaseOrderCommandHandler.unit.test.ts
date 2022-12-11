import { faker } from '@faker-js/faker';
import { StartPurchaseOrderData } from '@sales/app/commands/StartPurchaseOrderCommand';
import StartPurchaseOrderCommandHandler from '@sales/app/commands/StartPurchaseOrderCommandHandler';
import PurchaseOrder, { PurchaseOrderStatus } from '@sales/domain/PurchaseOrder';
import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

describe("StartPurchaseOrderCommandHandler's unit tests", () => {
  it('calls repository.getPurchaseOrderById with correct param', async () => {
    expect.assertions(1);

    const getPurchaseOrderByIdSpy = jest.spyOn(repositoryStub, 'getPurchaseOrderById');
    const handler = new StartPurchaseOrderCommandHandler(repositoryStub);

    const eventData: StartPurchaseOrderData = {
      purchaseOrderId: faker.datatype.uuid(),
      cardToken: faker.random.alphaNumeric(),
      installments: 3,
    };

    await handler.handle(eventData);

    expect(getPurchaseOrderByIdSpy).toHaveBeenCalledWith(eventData.purchaseOrderId);
  });

  it("returns FALSE if purchase order doesn't exist", async () => {
    expect.assertions(1);

    jest.spyOn(repositoryStub, 'getPurchaseOrderById')
      .mockResolvedValueOnce(null);
    const handler = new StartPurchaseOrderCommandHandler(repositoryStub);

    const eventData: StartPurchaseOrderData = {
      purchaseOrderId: faker.datatype.uuid(),
      cardToken: faker.random.alphaNumeric(),
      installments: 3,
    };

    const result = await handler.handle(eventData);

    expect(result).toBe(false);
  });

  it('calls PurchaseOrder.start method after found the purchase order by its id', async () => {
    expect.assertions(1);

    const purchaseOrder = new PurchaseOrder({
      id: faker.datatype.uuid(),
      customerId: faker.datatype.uuid(),
      code: parseInt(faker.datatype.number().toString(), 10),
      createdAt: new Date(),
      voucher: null,
      status: null,
    });

    const startSpy = jest.spyOn(purchaseOrder, 'start');

    jest.spyOn(repositoryStub, 'getPurchaseOrderById').mockResolvedValueOnce(purchaseOrder);

    const handler = new StartPurchaseOrderCommandHandler(repositoryStub);

    const eventData: StartPurchaseOrderData = {
      purchaseOrderId: faker.datatype.uuid(),
      cardToken: faker.random.alphaNumeric(),
      installments: 3,
    };

    await handler.handle(eventData);

    expect(startSpy).toHaveBeenCalledTimes(1);
  });

  it('calls repository.updatePurchaseOrder with correct purchase order', async () => {
    expect.assertions(2);

    const purchaseOrder = new PurchaseOrder({
      id: faker.datatype.uuid(),
      customerId: faker.datatype.uuid(),
      code: parseInt(faker.datatype.number().toString(), 10),
      createdAt: new Date(),
      voucher: null,
      status: null,
    });

    jest.spyOn(repositoryStub, 'getPurchaseOrderById').mockResolvedValueOnce(purchaseOrder);
    const updatePurchaseOrderSpy = jest.spyOn(repositoryStub, 'updatePurchaseOrder');

    const handler = new StartPurchaseOrderCommandHandler(repositoryStub);

    const eventData: StartPurchaseOrderData = {
      purchaseOrderId: faker.datatype.uuid(),
      cardToken: faker.random.alphaNumeric(),
      installments: 3,
    };

    await handler.handle(eventData);

    expect(updatePurchaseOrderSpy).toHaveBeenCalled();
    expect(updatePurchaseOrderSpy.mock.calls[0][0].status).toBe(PurchaseOrderStatus.STARTED);
  });

  it('returns FALSE when occurs an unexpected error', async () => {
    expect.assertions(1);

    jest.spyOn(repositoryStub, 'getPurchaseOrderById').mockRejectedValueOnce(new Error('test'));

    const handler = new StartPurchaseOrderCommandHandler(repositoryStub);

    const eventData: StartPurchaseOrderData = {
      purchaseOrderId: faker.datatype.uuid(),
      cardToken: faker.random.alphaNumeric(),
      installments: 3,
    };

    const result = await handler.handle(eventData);

    expect(result).toBe(false);
  });
});
