import { faker } from '@faker-js/faker';
import VoucherNotFoundError from '@sales/app/VoucherNotFoundError';
import GetVoucherQueryHandler from '@sales/app/handlers/GetVoucherQueryHandler';
import GetVoucherQuery from '@sales/app/queries/GetVoucherQuery';
import Voucher, { VoucherDiscountTypes } from '@sales/domain/Voucher';
import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

describe("GetVoucherQueryHandler's unit tests", () => {
  it('calls repository.getVoucherByCode with correct params', async () => {
    expect.assertions(1);

    const getVoucherByCodeSpy = jest.spyOn(repositoryStub, 'getVoucherByCode');

    const handler = new GetVoucherQueryHandler(repositoryStub);

    const query = new GetVoucherQuery(faker.datatype.number());

    await handler.handle(query);

    expect(getVoucherByCodeSpy).toHaveBeenCalledWith(query.voucher_code);
  });

  it('returns a result if purchase order exists', async () => {
    expect.assertions(1);

    const voucher = new Voucher({
      id: faker.datatype.uuid(),
      percentage_amount: faker.datatype.float(),
      raw_discount_amount: faker.datatype.float(),
      quantity: parseInt(faker.datatype.number().toString(), 10),
      type: VoucherDiscountTypes.ABSOLUTE,
      created_at: new Date(),
      expires_at: new Date(),
      usedAt: new Date(),
      active: false,
      code: parseInt(faker.datatype.number().toString(), 10),
    });

    jest.spyOn(repositoryStub, 'getVoucherByCode')
      .mockResolvedValueOnce(voucher);

    const handler = new GetVoucherQueryHandler(repositoryStub);

    const query = new GetVoucherQuery(faker.datatype.number());

    const result = await handler.handle(query);

    expect(result).toEqual(voucher.toObject());
  });

  it("throws a VoucherNotFoundError if purchase order item doesn't exist", () => {
    expect.assertions(2);

    jest.spyOn(repositoryStub, 'getVoucherByCode').mockResolvedValueOnce(null);

    const handler = new GetVoucherQueryHandler(repositoryStub);

    const query = new GetVoucherQuery(faker.datatype.number());

    handler.handle(query).catch((e: any) => {
      expect(e).toBeInstanceOf(VoucherNotFoundError);
      expect(e.message).toBe('Voucher não encontrado.');
    });
  });
});
