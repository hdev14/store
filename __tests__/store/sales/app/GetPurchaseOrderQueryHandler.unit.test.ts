import { faker } from '@faker-js/faker';
import PurchaseOrderNotFoundError from '@sales/app/PurchaseOrderNotFoundError';
import { GetPurchaseOrderParams } from '@sales/app/queries/GetPurchaseOrderQuery';
import GetPurchaseOrderQueryHandler from '@sales/app/queries/GetPurchaseOrderQueryHandler';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
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

  it('returns a result if purchase order exists', async () => {
    expect.assertions(1);

    jest.spyOn(repositoryStub, 'getPurchaseOrderById')
      .mockResolvedValueOnce(new PurchaseOrder({
        id: faker.datatype.uuid(),
        customerId: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        createdAt: new Date(),
        voucher: null,
        status: null,
      }));

    const handler = new GetPurchaseOrderQueryHandler(repositoryStub);

    const params: GetPurchaseOrderParams = {
      purchaseOrderId: faker.datatype.uuid(),
    };

    const result = await handler.handle(params);

    expect(result.results).toHaveLength(1);
  });

  it("throws a PurchaseOrderNotFoundError if purchase order doesn't exist", async () => {
    expect.assertions(2);

    jest.spyOn(repositoryStub, 'getPurchaseOrderById').mockResolvedValueOnce(null);

    const handler = new GetPurchaseOrderQueryHandler(repositoryStub);

    const params: GetPurchaseOrderParams = {
      purchaseOrderId: faker.datatype.uuid(),
    };

    try {
      await handler.handle(params);
    } catch (e: any) {
      expect(e).toBeInstanceOf(PurchaseOrderNotFoundError);
      expect(e.message).toBe('Pedido não encontrado.');
    }
  });
});
