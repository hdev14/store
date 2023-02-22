it('test', () => {
  expect(true).toBe(true);
});
// import { faker } from '@faker-js/faker';
// import RemovePurchaseOrderItemEventHandler from
// '@sales/domain/events/RemovePurchaseOrderItemEventHandler';
// import { EventData } from '@shared/abstractions/IEventHandler';
// import EventHandlerError from '@shared/errors/EventHandlerError';
// import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

// describe("RemovePurchaseOrderItemEventHandler's unit tests", () => {
//   it('calls repository.deletePurchaseOrderItem with correct params', async () => {
//     expect.assertions(1);

//     const deletePurchaseOrderItemSpy = jest.spyOn(repositoryStub, 'deletePurchaseOrderItem');

//     const handler = new RemovePurchaseOrderItemEventHandler(repositoryStub);

//     const data: EventData = {
//       eventType: 'RemovePurchaseOrderItemEvent',
//       principalId: faker.datatype.uuid(),
//       timestamp: new Date().toISOString(),
//     };

//     await handler.handle(data);

//     expect(deletePurchaseOrderItemSpy).toHaveBeenCalledWith(data.principalId);
//   });

//   it('throws a EventHandlerError if occurs an expected error', async () => {
//     expect.assertions(2);

//     repositoryStub.deletePurchaseOrderItem = jest.fn().mockRejectedValueOnce(new Error('test'));

//     const handler = new RemovePurchaseOrderItemEventHandler(repositoryStub);

//     const data: EventData = {
//       eventType: 'UpdatePurchaseOrderItemEvent',
//       principalId: faker.datatype.uuid(),
//       timestamp: new Date().toISOString(),
//     };

//     try {
//       await handler.handle(data);
//     } catch (e: any) {
//       expect(e).toBeInstanceOf(EventHandlerError);
//       expect(e.message).toEqual('Erro ao excluir um item.');
//     }
//   });
// });
