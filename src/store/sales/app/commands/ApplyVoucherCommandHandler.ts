import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import IHandler from '@shared/abstractions/IHandler';
import { ApplyVoucherCommandData } from './ApplyVoucherCommand';

// eslint-disable-next-line max-len
export default class ApplyVoucherCommandHandler implements IHandler<boolean, ApplyVoucherCommandData> {
  constructor(private readonly repository: IPurchaseOrderRepository) { }

  public async handle(data: ApplyVoucherCommandData): Promise<boolean> {
    try {
      const draftPurchaseOrder = await this.repository
        .getDraftPurchaseOrderByCustomerId(data.customerId);

      const voucher = await this.repository.getVoucherByCode(data.voucherCode);

      if (
        !draftPurchaseOrder
        || !voucher
        || !voucher.active
        || (voucher.expiresAt.getTime() < new Date().getTime())) {
        return false;
      }

      draftPurchaseOrder.applyVoucher(voucher);

      await this.repository.updatePurchaseOrder(draftPurchaseOrder);

      return true;
    } catch (e: any) {
      console.error(e.stack);
      return false;
    }
  }
}
