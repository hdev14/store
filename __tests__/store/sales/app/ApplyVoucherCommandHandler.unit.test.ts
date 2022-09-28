import { faker } from '@faker-js/faker';
import { ApplyVoucherCommandData } from '@sales/app/commands/ApplyVoucherCommand';
import ApplyVoucherCommandHandler from '@sales/app/commands/ApplyVoucherCommandHandler';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import { EventData } from '@shared/@types/events';
import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

describe("ApplyVoucherCommandHandler's unit tests", () => {
  it('calls repository.getDraftPurchaseOrderByCustomerId', async () => {
    expect.assertions(2);

    const getDraftPurchaseOrderByCustomerIdSpy = jest.spyOn(repositoryStub, 'getDraftPurchaseOrderByCustomerId');

    const handler = new ApplyVoucherCommandHandler(repositoryStub);

    const data: EventData<ApplyVoucherCommandData> = {
      principalId: faker.datatype.uuid(),
      customerId: faker.datatype.uuid(),
      voucherCode: parseInt(faker.datatype.number().toString(), 10),
      timestamp: new Date().toISOString(),
    };

    await handler.handle(data);

    expect(getDraftPurchaseOrderByCustomerIdSpy).toHaveBeenCalledTimes(1);
    expect(getDraftPurchaseOrderByCustomerIdSpy).toHaveBeenCalledWith(data.customerId);
  });

  it("returns FALSE if purchase order doesn't exist", async () => {
    expect.assertions(1);

    repositoryStub.getDraftPurchaseOrderByCustomerId = jest.fn()
      .mockResolvedValueOnce(null);

    const handler = new ApplyVoucherCommandHandler(repositoryStub);

    const data: EventData<ApplyVoucherCommandData> = {
      principalId: faker.datatype.uuid(),
      customerId: faker.datatype.uuid(),
      voucherCode: parseInt(faker.datatype.number().toString(), 10),
      timestamp: new Date().toISOString(),
    };

    const result = await handler.handle(data);

    expect(result).toBe(false);
  });

  it('calls repository.getVoucherByCode', async () => {
    expect.assertions(2);

    const getVoucherByCodeSpy = jest.spyOn(repositoryStub, 'getVoucherByCode');

    const handler = new ApplyVoucherCommandHandler(repositoryStub);

    const data: EventData<ApplyVoucherCommandData> = {
      principalId: faker.datatype.uuid(),
      customerId: faker.datatype.uuid(),
      voucherCode: parseInt(faker.datatype.number().toString(), 10),
      timestamp: new Date().toISOString(),
    };

    await handler.handle(data);

    expect(getVoucherByCodeSpy).toHaveBeenCalledTimes(1);
    expect(getVoucherByCodeSpy).toHaveBeenCalledWith(data.voucherCode);
  });

  it("returns FALSE if voucher doesn't exist", async () => {
    expect.assertions(1);

    repositoryStub.getVoucherByCode = jest.fn().mockResolvedValueOnce(null);

    const handler = new ApplyVoucherCommandHandler(repositoryStub);

    const data: EventData<ApplyVoucherCommandData> = {
      principalId: faker.datatype.uuid(),
      customerId: faker.datatype.uuid(),
      voucherCode: parseInt(faker.datatype.number().toString(), 10),
      timestamp: new Date().toISOString(),
    };

    const result = await handler.handle(data);

    expect(result).toBe(false);
  });
});
