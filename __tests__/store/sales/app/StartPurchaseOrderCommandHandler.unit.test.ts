import { faker } from '@faker-js/faker';
import { StartPurchaseOrderData } from '@sales/app/commands/StartPurchaseOrderCommand';
import StartPurchaseOrderCommandHandler from '@sales/app/commands/StartPurchaseOrderCommandHandler';
import Product from '@sales/domain/Product';
import PurchaseOrder, { PurchaseOrderStatus } from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import ChargePurchaseOrderEvent from '@shared/events/ChargePurchaseOrderEvent';
import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';
import publisherStub from '../../stubs/EventPublisherStub';

describe("StartPurchaseOrderCommandHandler's unit tests", () => {
  it('calls repository.getPurchaseOrderById with correct param', async () => {
    expect.assertions(1);

    const getPurchaseOrderByIdSpy = jest.spyOn(repositoryStub, 'getPurchaseOrderById');
    const handler = new StartPurchaseOrderCommandHandler(repositoryStub, publisherStub);

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
    const handler = new StartPurchaseOrderCommandHandler(repositoryStub, publisherStub);

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

    const handler = new StartPurchaseOrderCommandHandler(repositoryStub, publisherStub);

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

    const handler = new StartPurchaseOrderCommandHandler(repositoryStub, publisherStub);

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

    const handler = new StartPurchaseOrderCommandHandler(repositoryStub, publisherStub);

    const eventData: StartPurchaseOrderData = {
      purchaseOrderId: faker.datatype.uuid(),
      cardToken: faker.random.alphaNumeric(),
      installments: 3,
    };

    const result = await handler.handle(eventData);

    expect(result).toBe(false);
  });

  it('calls publisherStub.addEvent with correct events', async () => {
    expect.assertions(10);

    const purchaseOrder = new PurchaseOrder({
      id: faker.datatype.uuid(),
      customerId: faker.datatype.uuid(),
      code: parseInt(faker.datatype.number().toString(), 10),
      createdAt: new Date(),
      voucher: null,
      status: null,
      items: [
        new PurchaseOrderItem({
          id: faker.datatype.uuid(),
          quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
          product: new Product(
            faker.datatype.uuid(),
            faker.commerce.product(),
            faker.datatype.float(),
          ),
        }),
        new PurchaseOrderItem({
          id: faker.datatype.uuid(),
          quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
          product: new Product(
            faker.datatype.uuid(),
            faker.commerce.product(),
            faker.datatype.float(),
          ),
        }),
      ],
    });

    jest.spyOn(repositoryStub, 'getPurchaseOrderById').mockResolvedValueOnce(purchaseOrder);
    const addEventSpy = jest.spyOn(publisherStub, 'addEvent');

    const handler = new StartPurchaseOrderCommandHandler(repositoryStub, publisherStub);

    const data: StartPurchaseOrderData = {
      purchaseOrderId: faker.datatype.uuid(),
      cardToken: faker.random.alphaNumeric(),
      installments: 3,
    };

    await handler.handle(data);

    expect(addEventSpy).toHaveBeenCalledTimes(1);
    expect(addEventSpy.mock.calls[0][0]).toBe(ChargePurchaseOrderEvent);
    const eventData: any = addEventSpy.mock.calls[0][1];

    expect(eventData.principalId).toBe(purchaseOrder.id);
    expect(eventData.purchaseOrderId).toBe(purchaseOrder.id);
    expect(eventData.customerId).toBe(purchaseOrder.customerId);
    expect(eventData.purchaseOrderCode).toBe(purchaseOrder.code);
    expect(eventData.totalAmount).toBe(purchaseOrder.totalAmount);
    expect(eventData.cardToken).toBe(data.cardToken);
    expect(eventData.installments).toBe(data.installments);
    expect(eventData.items).toStrictEqual(purchaseOrder.items.map((item) => ({
      itemId: item.id,
      productId: item.product.id,
      quantity: item.quantity,
    })));
  });
});
