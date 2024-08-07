import { faker } from '@faker-js/faker';
import GetPurchaseOrdersQueryHandler from '@sales/app/handlers/GetPurchaseOrdersQueryHandler';
import GetPurchaseOrdersQuery from '@sales/app/queries/GetPurchaseOrdersQuery';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

describe("GetPurchaseOrdersQueryHandler's unit tests", () => {
  it('calls repository.getPuchaseOrdersByCustomerId with correct params', async () => {
    expect.assertions(1);

    const getPurchaseOrdersByCustomerId = jest.spyOn(repositoryStub, 'getPurchaseOrdersByCustomerId');

    const handler = new GetPurchaseOrdersQueryHandler(repositoryStub);

    const query = new GetPurchaseOrdersQuery(faker.datatype.uuid());

    await handler.handle(query);

    expect(getPurchaseOrdersByCustomerId).toHaveBeenCalledWith(query.customer_id);
  });

  it('returns an array of PurchaseOrder with purchase orders', async () => {
    expect.assertions(1);

    jest.spyOn(repositoryStub, 'getPurchaseOrdersByCustomerId')
      .mockResolvedValueOnce([
        new PurchaseOrder({
          id: faker.datatype.uuid(),
          customer_id: faker.datatype.uuid(),
          code: parseInt(faker.datatype.number().toString(), 10),
          created_at: new Date(),
          voucher: null,
          status: null,
          items: [],
        }),
        new PurchaseOrder({
          id: faker.datatype.uuid(),
          customer_id: faker.datatype.uuid(),
          code: parseInt(faker.datatype.number().toString(), 10),
          created_at: new Date(),
          voucher: null,
          status: null,
          items: [],
        }),
      ]);

    const handler = new GetPurchaseOrdersQueryHandler(repositoryStub);

    const query = new GetPurchaseOrdersQuery(faker.datatype.uuid());

    const result = await handler.handle(query);

    expect(result).toHaveLength(2);
  });
});
