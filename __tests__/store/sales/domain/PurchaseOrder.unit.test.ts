import { faker } from '@faker-js/faker';
import PurchaseOrder, { DraftPurchaseOrderParams, PurchaseOrderStatus } from '@sales/domain/PurchaseOrder';

describe("PurchaseOrder's unit tests", () => {
  it('creates a draft purchase order', () => {
    const params: DraftPurchaseOrderParams = {
      id: faker.datatype.uuid(),
      clientId: faker.datatype.uuid(),
      code: parseInt(faker.datatype.number().toString(), 10),
      createdAt: new Date(),
    };

    const draftPurchaseOrder = PurchaseOrder.createDraft(params);

    expect(draftPurchaseOrder).toEqual({
      ...params,
      status: PurchaseOrderStatus.DRAFT,
      voucher: undefined,
      discountAmount: 0,
      totalAmount: 0,
      _items: [],
    });
  });
});
