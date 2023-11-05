import { faker } from '@faker-js/faker';
import PurchaseOrderNotFoundError from '@sales/app/PurchaseOrderNotFoundError';
import VoucherInvalidError from '@sales/app/VoucherInvalidError';
import VoucherNotFoundError from '@sales/app/VoucherNotFoundError';
import ApplyVoucherCommand from '@sales/app/commands/ApplyVoucherCommand';
import ApplyVoucherCommandHandler from '@sales/app/handlers/ApplyVoucherCommandHandler';
import PurchaseOrder, { PurchaseOrderStatus } from '@sales/domain/PurchaseOrder';
import Voucher, { VoucherDiscountTypes } from '@sales/domain/Voucher';
import repositoryStub from '../../stubs/PurchaseOrderRepositoryStub';

describe("ApplyVoucherCommandHandler's unit tests", () => {
  it('calls repository.getDraftPurchaseOrderByCustomerId', async () => {
    expect.assertions(2);

    const getDraftPurchaseOrderByCustomerIdSpy = jest.spyOn(repositoryStub, 'getDraftPurchaseOrderByCustomerId');

    const handler = new ApplyVoucherCommandHandler(repositoryStub);

    const command = new ApplyVoucherCommand(
      faker.datatype.uuid(),
      parseInt(faker.datatype.number().toString(), 10),
    );

    await handler.handle(command);

    expect(getDraftPurchaseOrderByCustomerIdSpy).toHaveBeenCalledTimes(1);
    expect(getDraftPurchaseOrderByCustomerIdSpy).toHaveBeenCalledWith(command.customer_id);
  });

  it("throws a PurchaseOrderNotFoundError if purchase order doesn't exist", () => {
    expect.assertions(1);

    repositoryStub.getDraftPurchaseOrderByCustomerId = jest.fn()
      .mockResolvedValueOnce(null);

    const handler = new ApplyVoucherCommandHandler(repositoryStub);

    const command = new ApplyVoucherCommand(
      faker.datatype.uuid(),
      parseInt(faker.datatype.number().toString(), 10),
    );

    return handler.handle(command).catch((e) => {
      expect(e).toBeInstanceOf(PurchaseOrderNotFoundError);
    });
  });

  it('calls repository.getVoucherByCode', async () => {
    expect.assertions(2);

    repositoryStub.getDraftPurchaseOrderByCustomerId = jest.fn()
      .mockResolvedValueOnce(new PurchaseOrder({
        customer_id: faker.datatype.uuid(),
        code: parseInt(faker.random.numeric(), 10),
        created_at: new Date(),
        id: faker.datatype.uuid(),
        status: PurchaseOrderStatus.DRAFT,
        voucher: null,
        items: [],
      }));

    const getVoucherByCodeSpy = jest.spyOn(repositoryStub, 'getVoucherByCode');

    const handler = new ApplyVoucherCommandHandler(repositoryStub);

    const command = new ApplyVoucherCommand(
      faker.datatype.uuid(),
      parseInt(faker.datatype.number().toString(), 10),
    );

    await handler.handle(command);

    expect(getVoucherByCodeSpy).toHaveBeenCalledTimes(1);
    expect(getVoucherByCodeSpy).toHaveBeenCalledWith(command.voucher_code);
  });

  it("throws a VoucherNotFoundError if voucher doesn't exist", () => {
    expect.assertions(1);

    repositoryStub.getDraftPurchaseOrderByCustomerId = jest.fn()
      .mockResolvedValueOnce(new PurchaseOrder({
        customer_id: faker.datatype.uuid(),
        code: parseInt(faker.random.numeric(), 10),
        created_at: new Date(),
        id: faker.datatype.uuid(),
        status: PurchaseOrderStatus.DRAFT,
        voucher: null,
        items: [],
      }));

    repositoryStub.getVoucherByCode = jest.fn().mockResolvedValueOnce(null);

    const handler = new ApplyVoucherCommandHandler(repositoryStub);

    const command = new ApplyVoucherCommand(
      faker.datatype.uuid(),
      parseInt(faker.datatype.number().toString(), 10),
    );

    return handler.handle(command).catch((e) => {
      expect(e).toBeInstanceOf(VoucherNotFoundError);
    });
  });

  it('throws a VoucherInvalidError if voucher is deactive', () => {
    expect.assertions(1);

    repositoryStub.getDraftPurchaseOrderByCustomerId = jest.fn()
      .mockResolvedValueOnce(new PurchaseOrder({
        customer_id: faker.datatype.uuid(),
        code: parseInt(faker.random.numeric(), 10),
        created_at: new Date(),
        id: faker.datatype.uuid(),
        status: PurchaseOrderStatus.DRAFT,
        voucher: null,
        items: [],
      }));

    repositoryStub.getVoucherByCode = jest.fn().mockResolvedValueOnce(new Voucher({
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
    }));

    const handler = new ApplyVoucherCommandHandler(repositoryStub);

    const command = new ApplyVoucherCommand(
      faker.datatype.uuid(),
      parseInt(faker.datatype.number().toString(), 10),
    );

    return handler.handle(command).catch((e) => {
      expect(e).toBeInstanceOf(VoucherInvalidError);
    });
  });

  it('throws a VoucherInvalidError if voucher is expired', () => {
    expect.assertions(1);

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    repositoryStub.getDraftPurchaseOrderByCustomerId = jest.fn()
      .mockResolvedValueOnce(new PurchaseOrder({
        customer_id: faker.datatype.uuid(),
        code: parseInt(faker.random.numeric(), 10),
        created_at: new Date(),
        id: faker.datatype.uuid(),
        status: PurchaseOrderStatus.DRAFT,
        voucher: null,
        items: [],
      }));

    repositoryStub.getVoucherByCode = jest.fn().mockResolvedValueOnce(new Voucher({
      id: faker.datatype.uuid(),
      percentage_amount: faker.datatype.float(),
      raw_discount_amount: faker.datatype.float(),
      quantity: parseInt(faker.datatype.number().toString(), 10),
      type: VoucherDiscountTypes.ABSOLUTE,
      created_at: new Date(),
      expires_at: pastDate,
      usedAt: new Date(),
      active: true,
      code: parseInt(faker.datatype.number().toString(), 10),
    }));

    const handler = new ApplyVoucherCommandHandler(repositoryStub);

    const command = new ApplyVoucherCommand(
      faker.datatype.uuid(),
      parseInt(faker.datatype.number().toString(), 10),
    );

    return handler.handle(command).catch((e) => {
      expect(e).toBeInstanceOf(VoucherInvalidError);
    });
  });

  it('applies voucher to purchase order', async () => {
    expect.assertions(2);

    const fakeDraftPurchaseOrder: any = {
      applyVoucher: jest.fn(),
    };

    repositoryStub.getDraftPurchaseOrderByCustomerId = jest.fn()
      .mockResolvedValueOnce(fakeDraftPurchaseOrder);

    const voucher = new Voucher({
      id: faker.datatype.uuid(),
      percentage_amount: faker.datatype.float(),
      raw_discount_amount: faker.datatype.float(),
      quantity: parseInt(faker.datatype.number().toString(), 10),
      type: VoucherDiscountTypes.ABSOLUTE,
      created_at: new Date(),
      expires_at: faker.date.future(),
      usedAt: new Date(),
      active: true,
      code: parseInt(faker.datatype.number().toString(), 10),
    });

    repositoryStub.getVoucherByCode = jest.fn().mockResolvedValueOnce(voucher);

    const handler = new ApplyVoucherCommandHandler(repositoryStub);

    const command = new ApplyVoucherCommand(
      faker.datatype.uuid(),
      parseInt(faker.datatype.number().toString(), 10),
    );

    await handler.handle(command);

    expect(fakeDraftPurchaseOrder.applyVoucher).toHaveBeenCalledTimes(1);
    expect(fakeDraftPurchaseOrder.applyVoucher).toHaveBeenCalledWith(voucher);
  });

  it('calls repository.updatePurchaseOrder', async () => {
    expect.assertions(2);

    const purchaseOrder = new PurchaseOrder({
      customer_id: faker.datatype.uuid(),
      code: parseInt(faker.random.numeric(), 10),
      created_at: new Date(),
      id: faker.datatype.uuid(),
      status: PurchaseOrderStatus.DRAFT,
      voucher: null,
      items: [],
    });

    repositoryStub.getDraftPurchaseOrderByCustomerId = jest.fn()
      .mockResolvedValueOnce(purchaseOrder);

    const voucher = new Voucher({
      id: faker.datatype.uuid(),
      percentage_amount: faker.datatype.float(),
      raw_discount_amount: faker.datatype.float(),
      quantity: parseInt(faker.datatype.number().toString(), 10),
      type: VoucherDiscountTypes.ABSOLUTE,
      created_at: new Date(),
      expires_at: faker.date.future(),
      usedAt: new Date(),
      active: true,
      code: parseInt(faker.datatype.number().toString(), 10),
    });

    repositoryStub.getVoucherByCode = jest.fn().mockResolvedValueOnce(voucher);

    const updatePurchaseOrderSpy = jest.spyOn(repositoryStub, 'updatePurchaseOrder');

    const handler = new ApplyVoucherCommandHandler(repositoryStub);

    const command = new ApplyVoucherCommand(
      faker.datatype.uuid(),
      parseInt(faker.datatype.number().toString(), 10),
    );

    await handler.handle(command);

    expect(updatePurchaseOrderSpy).toHaveBeenCalledTimes(1);
    expect(updatePurchaseOrderSpy).toHaveBeenCalledWith(purchaseOrder);
  });
});
