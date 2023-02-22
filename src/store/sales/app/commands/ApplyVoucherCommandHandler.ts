import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import IHandler from '@shared/abstractions/IHandler';
import PurchaseOrderNotFoundError from '../PurchaseOrderNotFoundError';
import VoucherInvalidError from '../VoucherInvalidError';
import VoucherNotFoundError from '../VoucherNotFoundError';
import ApplyVoucherCommand from './ApplyVoucherCommand';

// eslint-disable-next-line max-len
export default class ApplyVoucherCommandHandler implements IHandler<ApplyVoucherCommand, void> {
  constructor(private readonly repository: IPurchaseOrderRepository) { }

  public async handle(event: ApplyVoucherCommand): Promise<void> {
    const draftPurchaseOrder = await this.repository
      .getDraftPurchaseOrderByCustomerId(event.customerId);

    if (!draftPurchaseOrder) {
      throw new PurchaseOrderNotFoundError();
    }

    const voucher = await this.repository.getVoucherByCode(event.voucherCode);

    if (!voucher) {
      throw new VoucherNotFoundError();
    }

    if (!voucher.active || (voucher.expiresAt.getTime() < new Date().getTime())) {
      throw new VoucherInvalidError();
    }

    draftPurchaseOrder.applyVoucher(voucher);

    await this.repository.updatePurchaseOrder(draftPurchaseOrder);
  }
}
