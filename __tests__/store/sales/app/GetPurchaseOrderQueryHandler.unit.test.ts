import { faker } from '@faker-js/faker';
import { GetPurchaseOrderParams } from '@sales/app/queries/GetPurchaseOrderQuery';
import GetPurchaseOrderQueryHandler from '@sales/app/queries/GetPurchaseOrderQueryHandler';
import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

describe("GetPurchaseOrderQueryHandler's unit tests", () => {
  it('calls repository.getPurchaseOrderById with correct params', async () => {
    expect.assertions(1);

    const getPurchaseOrderByIdSpy = jest.spyOn(repositoryStub, 'getPurchaseOrderById');

    const handler = new GetPurchaseOrderQueryHandler(repositoryStub);

    const params: GetPurchaseOrderParams = {
      purchaseOrderId: faker.datatype.uuid(),
    };

    await handler.handle(params);

    expect(getPurchaseOrderByIdSpy).toHaveBeenCalledWith(params.purchaseOrderId);
  });
});
