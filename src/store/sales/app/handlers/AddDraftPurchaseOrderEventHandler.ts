import AddDraftPurchaseOrderEvent from '@sales/domain/events/AddDraftPurchaseOrderEvent';
import { IPurchaseOrderRepositoryCommands } from '@sales/domain/IPurchaseOrderRepository';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import IHandler from '@shared/abstractions/IHandler';
import EventHandlerError from '@shared/errors/EventHandlerError';

// eslint-disable-next-line max-len
export default class AddDraftPurchaseOrderEventHandler implements IHandler<AddDraftPurchaseOrderEvent> {
  constructor(private readonly repository: IPurchaseOrderRepositoryCommands) { }

  public async handle(event: AddDraftPurchaseOrderEvent): Promise<any> {
    try {
      const draft_purchase_order = PurchaseOrder.createDraft({
        id: event.principal_id,
        code: event.code,
        customer_id: event.customer_id,
        total_amount: event.total_amount,
        discount_amount: event.discount_amount,
        created_at: event.created_at,
        status: null,
        voucher: null,
        items: [],
      });

      await this.repository.addPurchaseOrder(draft_purchase_order);
    } catch (e: any) {
      console.error(e.stack);
      throw new EventHandlerError('Erro ao cadastrar o pedido.', { cause: e.stack });
    }
  }
}
