import { faker } from '@faker-js/faker';
import PurchaseOrderNotFoundError from '@sales/app/PurchaseOrderNotFoundError';
import GetPurchaseOrderQueryHandler from '@sales/app/handlers/GetPurchaseOrderQueryHandler';
import GetPurchaseOrderQuery from '@sales/app/queries/GetPurchaseOrderQuery';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

describe("GetPurchaseOrderQueryHandler's unit tests", () => {
  it('calls repository.getPurchaseOrderById with correct params', async () => {
    expect.assertions(1);

    const getPurchaseOrderByIdSpy = jest.spyOn(repositoryStub, 'getPurchaseOrderById');

    const handler = new GetPurchaseOrderQueryHandler(repositoryStub);

    const query = new GetPurchaseOrderQuery(faker.datatype.uuid());

    await handler.handle(query);

    expect(getPurchaseOrderByIdSpy).toHaveBeenCalledWith(query.purchase_order_id);
  });

  it('returns a PurchaseOrder if purchase order exists', async () => {
    expect.assertions(1);

    const purchaseOrder = new PurchaseOrder({
      id: faker.datatype.uuid(),
      customer_id: faker.datatype.uuid(),
      code: parseInt(faker.datatype.number().toString(), 10),
      created_at: new Date(),
      voucher: null,
      status: null,
      items: [],
    });

    jest.spyOn(repositoryStub, 'getPurchaseOrderById')
      .mockResolvedValueOnce(purchaseOrder);

    const handler = new GetPurchaseOrderQueryHandler(repositoryStub);

    const query = new GetPurchaseOrderQuery(faker.datatype.uuid());

    const result = await handler.handle(query);

    expect(result).toEqual(purchaseOrder);
  });

  it("throws a PurchaseOrderNotFoundError if purchase order doesn't exist", () => {
    expect.assertions(2);

    jest.spyOn(repositoryStub, 'getPurchaseOrderById').mockResolvedValueOnce(null);

    const handler = new GetPurchaseOrderQueryHandler(repositoryStub);

    const query = new GetPurchaseOrderQuery(faker.datatype.uuid());

    return handler.handle(query).catch((e: any) => {
      expect(e).toBeInstanceOf(PurchaseOrderNotFoundError);
      expect(e.message).toBe('Pedido não encontrado.');
    });
  });
});
