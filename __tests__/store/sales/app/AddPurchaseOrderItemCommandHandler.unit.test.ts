import { faker } from '@faker-js/faker';
import { AddPurchaseOrderItemData } from '@sales/app/AddPurchaseOrderItemCommand';
import AddPurchaseOrderItemCommandHandler from '@sales/app/AddPurchaseOrderItemCommandHandler';
import { EventData } from '@shared/@types/events';
import RepositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

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

    const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(repository);

    await addPurchaseOrderItemCommandHandler.handle(data);

    expect(getDraftPurchaseOrderByClientIdSpy).toHaveBeenCalledTimes(1);
    expect(getDraftPurchaseOrderByClientIdSpy).toHaveBeenCalledWith(data.clientId);
  });
});
