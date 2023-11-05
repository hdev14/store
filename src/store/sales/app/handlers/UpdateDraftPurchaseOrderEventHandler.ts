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
      const purchase_order = PurchaseOrder.createDraft({
        id: event.principal_id,
        code: event.code,
        discount_amount: event.discount_amount,
        total_amount: event.total_amount,
        customer_id: event.customer_id,
        created_at: new Date(),
        status: null,
        voucher: null,
        items: [],
      });

      await this.repository.updatePurchaseOrder(purchase_order);
    } catch (e: any) {
      console.error(e.stack);
      throw new EventHandlerError('Erro ao atualizar o pedido.', { cause: e.stack });
    }
  }
}
