import { faker } from '@faker-js/faker';
import { GetVoucherParams } from '@sales/app/queries/GetVoucherQuery';
import GetVoucherQueryHandler from '@sales/app/queries/GetVoucherQueryHandler';
import VoucherNotFoundError from '@sales/app/VoucherNotFoundError';
import Voucher, { VoucherDiscountTypes } from '@sales/domain/Voucher';
import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

describe("GetVoucherQueryHandler's unit tests", () => {
  it('calls repository.getVoucherByCode with correct params', async () => {
    expect.assertions(1);

    const getVoucherByCodeSpy = jest.spyOn(repositoryStub, 'getVoucherByCode');

    const handler = new GetVoucherQueryHandler(repositoryStub);

    const params: GetVoucherParams = {
      voucherCode: faker.datatype.number(),
    };

    await handler.handle(params);

    expect(getVoucherByCodeSpy).toHaveBeenCalledWith(params.voucherCode);
  });

  it('returns a result if purchase order exists', async () => {
    expect.assertions(1);

    jest.spyOn(repositoryStub, 'getVoucherByCode')
      .mockResolvedValueOnce(new Voucher({
        id: faker.datatype.uuid(),
        percentageAmount: faker.datatype.float(),
        rawDiscountAmount: faker.datatype.float(),
        quantity: parseInt(faker.datatype.number().toString(), 10),
        type: VoucherDiscountTypes.ABSOLUTE,
        createdAt: new Date(),
        expiresAt: new Date(),
        usedAt: new Date(),
        active: false,
        code: parseInt(faker.datatype.number().toString(), 10),
      }));

    const handler = new GetVoucherQueryHandler(repositoryStub);

    const params: GetVoucherParams = {
      voucherCode: faker.datatype.number(),
    };

    const result = await handler.handle(params);

    expect(result.results).toHaveLength(1);
  });

  it("throws a VoucherNotFoundError if purchase order item doesn't exist", async () => {
    expect.assertions(2);

    jest.spyOn(repositoryStub, 'getVoucherByCode').mockResolvedValueOnce(null);

    const handler = new GetVoucherQueryHandler(repositoryStub);

    const params: GetVoucherParams = {
      voucherCode: faker.datatype.number(),
    };

    try {
      await handler.handle(params);
    } catch (e: any) {
      expect(e).toBeInstanceOf(VoucherNotFoundError);
      expect(e.message).toBe('Voucher não encontrado.');
    }
  });
});
