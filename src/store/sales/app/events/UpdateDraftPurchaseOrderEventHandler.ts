import { IPurchaseOrderRepositoryCommands } from '@sales/domain/IPurchaseOrderRepository';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import IEventHandler, { EventData } from '@shared/abstractions/IEventHandler';
import EventHandlerError from '@shared/errors/EventHandlerError';
import { UpdateDraftPurchaseOrderEventData } from './UpdateDraftPurchaseOrderEvent';

// eslint-disable-next-line max-len
export default class UpdateDraftPurchaseOrderEventHandler implements IEventHandler<UpdateDraftPurchaseOrderEventData> {
  constructor(private readonly repository: IPurchaseOrderRepositoryCommands) { }

  public async handle(data: EventData<UpdateDraftPurchaseOrderEventData>): Promise<void> {
    try {
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
    } catch (e: any) {
      console.error(e.stack);
      throw new EventHandlerError('Erro ao atualizar o pedido.', { cause: e.stack });
    }
  }
}
