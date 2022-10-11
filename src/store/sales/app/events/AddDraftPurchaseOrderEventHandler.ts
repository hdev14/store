import { IPurchaseOrderRepositoryCommands } from '@sales/domain/IPurchaseOrderRepository';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import { EventData, IEventHandler } from '@shared/@types/events';
import EventHandlerError from '@shared/errors/EventHandlerError';
import { AddDraftPurchaseOrderEventData } from './AddDraftPurchaseOrderEvent';

export default class AddDraftPurchaseOrderEventHandler implements IEventHandler<void> {
  private readonly repository: IPurchaseOrderRepositoryCommands;

  constructor(repository: IPurchaseOrderRepositoryCommands) {
    this.repository = repository;
  }

  public async handle(data: EventData<AddDraftPurchaseOrderEventData>): Promise<void> {
    try {
      const draftPurchaseOrder = PurchaseOrder.createDraft({
        id: data.principalId,
        code: data.code,
        customerId: data.customerId,
        totalAmount: data.totalAmount,
        discountAmount: data.discountAmount,
        createdAt: data.createdAt,
        status: null,
        voucher: null,
      });

      await this.repository.addPurchaseOrder(draftPurchaseOrder);
    } catch (e: any) {
      console.error(e.stack);
      throw new EventHandlerError('Erro ao cadastrar o pedido.', { cause: e.stack });
    }
  }
}
