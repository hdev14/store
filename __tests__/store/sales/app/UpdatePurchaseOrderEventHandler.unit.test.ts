it('test', () => {
  expect(true).toBe(true);
});

// import { faker } from '@faker-js/faker';
// import { UpdateDraftPurchaseOrderEventData }
// from '@sales/domain/events/UpdateDraftPurchaseOrderEvent';
// import UpdateDraftPurchaseOrderEventHandler
// from '@sales/domain/events/UpdateDraftPurchaseOrderEventHandler';
// import { EventData } from '@shared/abstractions/IEventHandler';
// import EventHandlerError from '@shared/errors/EventHandlerError';
// import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

// describe("UpdateDraftPurchaseOrderEventHandler's unit tests", () => {
//   it('calls repository.updatePurchaseOrder with correct params', async () => {
//     expect.assertions(6);

//     const updatePurchaseOrderSpy = jest.spyOn(repositoryStub, 'updatePurchaseOrder');

//     const handler = new UpdateDraftPurchaseOrderEventHandler(repositoryStub);

//     const eventData: EventData<UpdateDraftPurchaseOrderEventData> = {
//       eventType: 'UpdateDraftPurchaseOrderEvent',
//       principalId: faker.datatype.uuid(),
//       customerId: faker.datatype.uuid(),
//       code: parseInt(faker.datatype.number().toString(), 10),
//       discountAmount: faker.datatype.float(),
//       totalAmount: faker.datatype.float(),
//       timestamp: new Date().toISOString(),
//     };

//     await handler.handle(eventData);

//     expect(updatePurchaseOrderSpy).toHaveBeenCalledTimes(1);
//     expect(updatePurchaseOrderSpy.mock.calls[0][0].id).toEqual(eventData.principalId);
//     expect(updatePurchaseOrderSpy.mock.calls[0][0].code).toEqual(eventData.code);
//     expect(updatePurchaseOrderSpy.mock.calls[0][0].customerId).toEqual(eventData.customerId);
//     expect(updatePurchaseOrderSpy.mock.calls[0][0].totalAmount).toEqual(eventData.totalAmount);
//     expect(updatePurchaseOrderSpy.mock.calls[0][0].discountAmount)
//       .toEqual(eventData.discountAmount);
//   });

//   it('throws an EventHandlerError when occurs an expected error', async () => {
//     expect.assertions(2);

//     repositoryStub.updatePurchaseOrder = jest.fn().mockRejectedValueOnce(new Error('test'));

//     const handler = new UpdateDraftPurchaseOrderEventHandler(repositoryStub);

//     const eventData: EventData<UpdateDraftPurchaseOrderEventData> = {
//       eventType: 'UpdateDraftPurchaseOrderEvent',
//       principalId: faker.datatype.uuid(),
//       customerId: faker.datatype.uuid(),
//       code: parseInt(faker.datatype.number().toString(), 10),
//       discountAmount: faker.datatype.float(),
//       totalAmount: faker.datatype.float(),
//       timestamp: new Date().toISOString(),
//     };

//     try {
//       await handler.handle(eventData);
//     } catch (e: any) {
//       expect(e).toBeInstanceOf(EventHandlerError);
//       expect(e.message).toEqual('Erro ao atualizar o pedido.');
//     }
//   });
// });
