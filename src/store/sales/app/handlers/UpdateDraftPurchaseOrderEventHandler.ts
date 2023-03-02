import UpdateDraftPurchaseOrderEvent from '@sales/domain/events/UpdateDraftPurchaseOrderEvent';
import { IPurchaseOrderRepositoryCommands } from '@sales/domain/IPurchaseOrderRepository';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import IHandler from '@shared/abstractions/IHandler';
import EventHandlerError from '@shared/errors/EventHandlerError';

// eslint-disable-next-line max-len
export default class UpdateDraftPurchaseOrderEventHandler implements IHandler<UpdateDraftPurchaseOrderEvent> {
  constructor(private readonly repository: IPurchaseOrderRepositoryCommands) { }

  public async handle(event: UpdateDraftPurchaseOrderEvent): Promise<any> {
    try {
      const purchaseOrder = PurchaseOrder.createDraft({
        id: event.principalId,
        code: event.code,
        discountAmount: event.discountAmount,
        totalAmount: event.totalAmount,
        customerId: event.customerId,
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
