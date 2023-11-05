import { IPurchaseOrderRepositoryCommands } from '@sales/domain/IPurchaseOrderRepository';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import UpdatePurchaseOrderItemEvent from '@sales/domain/events/UpdatePurchaseOrderItemEvent';
import IHandler from '@shared/abstractions/IHandler';
import EventHandlerError from '@shared/errors/EventHandlerError';

// eslint-disable-next-line max-len
export default class UpdatePurchaseOrderItemEventHandler implements IHandler<UpdatePurchaseOrderItemEvent> {
  constructor(private readonly repository: IPurchaseOrderRepositoryCommands) { }

  public async handle(event: UpdatePurchaseOrderItemEvent): Promise<any> {
    try {
      const purchase_order_item = new PurchaseOrderItem({
        id: event.principal_id,
        quantity: event.quantity,
        product: {
          id: event.product_id,
          name: event.product_name,
          amount: event.product_amount,
        },
      });

      await this.repository.updatePurchaseOrderItem(purchase_order_item);
    } catch (e: any) {
      console.error(e.stack);
      throw new EventHandlerError('Erro ao atualizar um item.', { cause: e.stack });
    }
  }
}
