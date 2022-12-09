import { faker } from '@faker-js/faker';
import PurchaseOrderItemNotFoundError from '@sales/app/PurchaseOrderItemNotFoundError';
import { GetPurchaseOrderItemParams } from '@sales/app/queries/GetPurchaseOrderItemQuery';
import GetPurchaseOrderItemQueryHandler from '@sales/app/queries/GetPurchaseOrderItemQueryHandler';
import Product from '@sales/domain/Product';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

describe("GetPurchaseOrderItemQueryHandler's unit tests", () => {
  it('calls repository.getPurchaseOrderItemById with correct params', async () => {
    expect.assertions(1);

    const getPurchaseOrderItemByIdSpy = jest.spyOn(repositoryStub, 'getPurchaseOrderItemById');

    const handler = new GetPurchaseOrderItemQueryHandler(repositoryStub);

    const params: GetPurchaseOrderItemParams = {
      purchaseOrderItemId: faker.datatype.uuid(),
    };

    await handler.handle(params);

    expect(getPurchaseOrderItemByIdSpy).toHaveBeenCalledWith(params.purchaseOrderItemId);
  });

  it('returns a result if purchase order exists', async () => {
    expect.assertions(1);

    jest.spyOn(repositoryStub, 'getPurchaseOrderItemById')
      .mockResolvedValueOnce(new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
        product: new Product(
          faker.datatype.uuid(),
          faker.commerce.product(),
          faker.datatype.float(),
        ),
      }));

    const handler = new GetPurchaseOrderItemQueryHandler(repositoryStub);

    const params: GetPurchaseOrderItemParams = {
      purchaseOrderItemId: faker.datatype.uuid(),
    };

    const result = await handler.handle(params);

    expect(result.results).toHaveLength(1);
  });

  it("throws a PurchaseOrderItemNotFoundError if purchase order item doesn't exist", async () => {
    expect.assertions(2);

    jest.spyOn(repositoryStub, 'getPurchaseOrderItemById').mockResolvedValueOnce(null);

    const handler = new GetPurchaseOrderItemQueryHandler(repositoryStub);

    const params: GetPurchaseOrderItemParams = {
      purchaseOrderItemId: faker.datatype.uuid(),
    };

    try {
      await handler.handle(params);
    } catch (e: any) {
      expect(e).toBeInstanceOf(PurchaseOrderItemNotFoundError);
      expect(e.message).toBe('Item não encontrado.');
    }
  });
});
