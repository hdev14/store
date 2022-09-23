import { IPurchaseOrderRepositoryCommands } from '@sales/domain/IPurchaseOrderRepository';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import { EventData, IEventHandler } from '@shared/@types/events';
import { AddDraftPurchaseOrderEventData } from './AddDraftPurchaseOrderEvent';

export default class AddDraftPurchaseOrderEventHandler implements IEventHandler<void> {
  private repository: IPurchaseOrderRepositoryCommands;

  constructor(repository: IPurchaseOrderRepositoryCommands) {
    this.repository = repository;
  }

  public async handle(data: EventData<AddDraftPurchaseOrderEventData>): Promise<void> {
    const draftPurchaseOrder = PurchaseOrder.createDraft({
      id: data.principalId,
      code: data.code,
      customerId: data.customerId,
      createdAt: data.createdAt,
      status: null,
      voucher: null,
    });

    await this.repository.addPurchaseOrder(draftPurchaseOrder);
  }
}
