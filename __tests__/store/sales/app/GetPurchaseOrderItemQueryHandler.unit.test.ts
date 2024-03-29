import { faker } from '@faker-js/faker';
import PurchaseOrderItemNotFoundError from '@sales/app/PurchaseOrderItemNotFoundError';
import GetPurchaseOrderItemQueryHandler from '@sales/app/handlers/GetPurchaseOrderItemQueryHandler';
import GetPurchaseOrderItemQuery from '@sales/app/queries/GetPurchaseOrderItemQuery';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

describe("GetPurchaseOrderItemQueryHandler's unit tests", () => {
  it('calls repository.getPurchaseOrderItemById with correct params', async () => {
    expect.assertions(1);

    const getPurchaseOrderItemByIdSpy = jest.spyOn(repositoryStub, 'getPurchaseOrderItemById');

    const handler = new GetPurchaseOrderItemQueryHandler(repositoryStub);

    const query = new GetPurchaseOrderItemQuery(faker.datatype.uuid());

    await handler.handle(query);

    expect(getPurchaseOrderItemByIdSpy).toHaveBeenCalledWith(query.purchase_order_item_id);
  });

  it('returns a PurchaseOrderItem if purchase order exists', async () => {
    expect.assertions(1);

    const purchaseOrderItem = new PurchaseOrderItem({
      id: faker.datatype.uuid(),
      quantity: parseInt(faker.datatype.number({ min: 1 }).toString(), 10),
      product: {
        id: faker.datatype.uuid(),
        name: faker.commerce.product(),
        amount: faker.datatype.float(),
      },
    });

    jest.spyOn(repositoryStub, 'getPurchaseOrderItemById')
      .mockResolvedValueOnce(purchaseOrderItem);

    const handler = new GetPurchaseOrderItemQueryHandler(repositoryStub);

    const query = new GetPurchaseOrderItemQuery(faker.datatype.uuid());

    const result = await handler.handle(query);

    expect(result).toEqual(purchaseOrderItem);
  });

  it("throws a PurchaseOrderItemNotFoundError if purchase order item doesn't exist", () => {
    expect.assertions(2);

    jest.spyOn(repositoryStub, 'getPurchaseOrderItemById').mockResolvedValueOnce(null);

    const handler = new GetPurchaseOrderItemQueryHandler(repositoryStub);

    const query = new GetPurchaseOrderItemQuery(faker.datatype.uuid());

    return handler.handle(query).catch((e: any) => {
      expect(e).toBeInstanceOf(PurchaseOrderItemNotFoundError);
      expect(e.message).toBe('Item não encontrado.');
    });
  });
});
