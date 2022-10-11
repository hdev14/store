import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import { EventData, IEventHandler } from '@shared/@types/events';
import { ApplyVoucherCommandData } from './ApplyVoucherCommand';

export default class ApplyVoucherCommandHandler implements IEventHandler<boolean> {
  private readonly repository: IPurchaseOrderRepository;

  constructor(repository: IPurchaseOrderRepository) {
    this.repository = repository;
  }

  public async handle(data: EventData<ApplyVoucherCommandData>): Promise<boolean> {
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
