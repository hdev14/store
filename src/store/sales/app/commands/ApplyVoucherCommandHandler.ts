import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import { EventData, IEventHandler } from '@shared/@types/events';
import { ApplyVoucherCommandData } from './ApplyVoucherCommand';

export default class ApplyVoucherCommandHandler implements IEventHandler<boolean> {
  private repository: IPurchaseOrderRepository;

  constructor(repository: IPurchaseOrderRepository) {
    this.repository = repository;
  }

  public async handle(data: EventData<ApplyVoucherCommandData>): Promise<boolean> {
    const draftPurchaseOrder = await this.repository
      .getDraftPurchaseOrderByCustomerId(data.customerId);

    if (!draftPurchaseOrder) {
      return false;
    }

    return false;
  }
}
