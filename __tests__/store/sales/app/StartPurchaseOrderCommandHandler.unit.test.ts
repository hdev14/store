import { faker } from '@faker-js/faker';
import { StartPurchaseOrderData } from '@sales/app/commands/StartPurchaseOrderCommand';
import StartPurchaseOrderCommandHandler from '@sales/app/commands/StartPurchaseOrderCommandHandler';
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

  // it('throws an EventHandlerError when occurs an expected error', async () => {
  //   expect.assertions(2);

  //   repositoryStub.addPurchaseOrder = jest.fn().mockRejectedValueOnce(new Error('test'));

  //   const handler = new StartPurchaseOrderCommandHandler(repositoryStub);

  //   const eventData: EventData<AddDraftPurchaseOrderEventData> = {
  //     principalId: faker.datatype.uuid(),
  //     customerId: faker.datatype.uuid(),
  //     code: parseInt(faker.datatype.number().toString(), 10),
  //     totalAmount: faker.datatype.float(),
  //     discountAmount: faker.datatype.float(),
  //     createdAt: new Date(),
  //     timestamp: new Date().toISOString(),
  //     eventType: 'AddDraftPurchaseOrderEvent',
  //   };

  //   try {
  //     await handler.handle(eventData);
  //   } catch (e: any) {
  //     expect(e).toBeInstanceOf(EventHandlerError);
  //     expect(e.message).toEqual('Erro ao cadastrar o pedido.');
  //   }
  // });
});
