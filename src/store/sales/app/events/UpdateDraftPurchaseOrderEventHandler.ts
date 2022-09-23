import { IPurchaseOrderRepositoryCommands } from '@sales/domain/IPurchaseOrderRepository';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import { EventData, IEventHandler } from '@shared/@types/events';
import { UpdateDraftPurchaseOrderEventData } from './UpdateDraftPurchaseOrderEvent';

export default class UpdateDraftPurchaseOrderEventHandler implements IEventHandler<void> {
  private repository: IPurchaseOrderRepositoryCommands;

  constructor(repository: IPurchaseOrderRepositoryCommands) {
    this.repository = repository;
  }

  public async handle(data: EventData<UpdateDraftPurchaseOrderEventData>): Promise<void> {
    const purchaseOrder = PurchaseOrder.createDraft({
      id: data.principalId,
      code: data.code,
      discountAmount: data.discountAmount,
      totalAmount: data.totalAmount,
      customerId: data.customerId,
      createdAt: new Date(),
      status: null,
      voucher: null,
    });

    await this.repository.updatePurchaseOrder(purchaseOrder);
  }
}
