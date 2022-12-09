import { faker } from '@faker-js/faker';
import { GetPurchaseOrdersParams } from '@sales/app/queries/GetPurchaseOrdersQuery';
import GetPurchaseOrdersQueryHandler from '@sales/app/queries/GetPurchaseOrdersQueryHandler';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

describe("GetPurchaseOrdersQueryHandler's unit tests", () => {
  it('calls repository.getPuchaseOrdersByCustomerId with correct params', async () => {
    expect.assertions(1);

    const getPurchaseOrdersByCustomerId = jest.spyOn(repositoryStub, 'getPurchaseOrdersByCustomerId');

    const handler = new GetPurchaseOrdersQueryHandler(repositoryStub);

    const params: GetPurchaseOrdersParams = {
      customerId: faker.datatype.uuid(),
    };

    await handler.handle(params);

    expect(getPurchaseOrdersByCustomerId).toHaveBeenCalledWith(params.customerId);
  });

  it('returns a result with purchase orders', async () => {
    expect.assertions(1);

    jest.spyOn(repositoryStub, 'getPurchaseOrdersByCustomerId')
      .mockResolvedValueOnce([
        new PurchaseOrder({
          id: faker.datatype.uuid(),
          customerId: faker.datatype.uuid(),
          code: parseInt(faker.datatype.number().toString(), 10),
          createdAt: new Date(),
          voucher: null,
          status: null,
        }),
        new PurchaseOrder({
          id: faker.datatype.uuid(),
          customerId: faker.datatype.uuid(),
          code: parseInt(faker.datatype.number().toString(), 10),
          createdAt: new Date(),
          voucher: null,
          status: null,
        }),
      ]);

    const handler = new GetPurchaseOrdersQueryHandler(repositoryStub);

    const params: GetPurchaseOrdersParams = {
      customerId: faker.datatype.uuid(),
    };

    const result = await handler.handle(params);

    expect(result.results).toHaveLength(2);
  });
});
