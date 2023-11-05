import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import IHandler from '@shared/abstractions/IHandler';
import PurchaseOrderNotFoundError from '../PurchaseOrderNotFoundError';
import VoucherInvalidError from '../VoucherInvalidError';
import VoucherNotFoundError from '../VoucherNotFoundError';
import ApplyVoucherCommand from '../commands/ApplyVoucherCommand';

// eslint-disable-next-line max-len
export default class ApplyVoucherCommandHandler implements IHandler<ApplyVoucherCommand, void> {
  constructor(private readonly repository: IPurchaseOrderRepository) { }

  public async handle(event: ApplyVoucherCommand): Promise<void> {
    const draft_purchase_order = await this.repository
      .getDraftPurchaseOrderByCustomerId(event.customer_id);

    if (!draft_purchase_order) {
      throw new PurchaseOrderNotFoundError();
    }

    const voucher = await this.repository.getVoucherByCode(event.voucher_code);

    if (!voucher) {
      throw new VoucherNotFoundError();
    }

    if (!voucher.active || (voucher.expires_at.getTime() < new Date().getTime())) {
      throw new VoucherInvalidError();
    }

    draft_purchase_order.applyVoucher(voucher);

    await this.repository.updatePurchaseOrder(draft_purchase_order);
  }
}
