import { faker } from '@faker-js/faker';
import StartPurchaseOrderCommand from '@sales/app/commands/StartPurchaseOrderCommand';
import StartPurchaseOrderCommandHandler from '@sales/app/commands/StartPurchaseOrderCommandHandler';
import PurchaseOrder, { PurchaseOrderStatus } from '@sales/domain/PurchaseOrder';
import PurchaseOrderNotFoundError from '@sales/app/PurchaseOrderNotFoundError';
import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

describe("StartPurchaseOrderCommandHandler's unit tests", () => {
  it('calls repository.getPurchaseOrderById with correct param', async () => {
    expect.assertions(1);

    const getPurchaseOrderByIdSpy = jest.spyOn(repositoryStub, 'getPurchaseOrderById');
    const handler = new StartPurchaseOrderCommandHandler(repositoryStub);

    const command = new StartPurchaseOrderCommand(
      faker.datatype.uuid(),
      faker.random.alphaNumeric(),
      3,
    );

    await handler.handle(command);

    expect(getPurchaseOrderByIdSpy).toHaveBeenCalledWith(command.purchaseOrderId);
  });

  it("returns PurchaseOrderNotFound if purchase order doesn't exist", async () => {
    expect.assertions(2);

    jest.spyOn(repositoryStub, 'getPurchaseOrderById')
      .mockResolvedValueOnce(null);

    const handler = new StartPurchaseOrderCommandHandler(repositoryStub);

    const command = new StartPurchaseOrderCommand(
      faker.datatype.uuid(),
      faker.random.alphaNumeric(),
      3,
    );

    try {
      await handler.handle(command);
    } catch (e: any) {
      expect(e).toBeInstanceOf(PurchaseOrderNotFoundError);
      expect(e.message).toEqual('Pedido não encontrado.');
    }
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
      customerId: faker.datatype.uuid(),
      code: parseInt(faker.datatype.number().toString(), 10),
      createdAt: new Date(),
      voucher: null,
      status: null,
    });

    jest.spyOn(repositoryStub, 'getPurchaseOrderById').mockResolvedValueOnce(purchaseOrder);
    const updatePurchaseOrderSpy = jest.spyOn(repositoryStub, 'updatePurchaseOrder');

    const handler = new StartPurchaseOrderCommandHandler(repositoryStub);

    const command = new StartPurchaseOrderCommand(
      faker.datatype.uuid(),
      faker.random.alphaNumeric(),
      3,
    );

    await handler.handle(command);

    expect(updatePurchaseOrderSpy).toHaveBeenCalled();
    expect(updatePurchaseOrderSpy.mock.calls[0][0].status).toBe(PurchaseOrderStatus.STARTED);
  });
});
