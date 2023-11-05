import AddPurchaseOrderItemEvent from '@sales/domain/events/AddPurchaseOrderItemEvent';
import { IPurchaseOrderRepositoryCommands } from '@sales/domain/IPurchaseOrderRepository';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import IHandler from '@shared/abstractions/IHandler';
import EventHandlerError from '@shared/errors/EventHandlerError';

// eslint-disable-next-line max-len
export default class AddPurchaseOrderItemEventHandler implements IHandler<AddPurchaseOrderItemEvent> {
  constructor(private readonly repository: IPurchaseOrderRepositoryCommands) { }

  public async handle(event: AddPurchaseOrderItemEvent): Promise<any> {
    try {
      const purchase_order_item = new PurchaseOrderItem({
        id: event.principal_id,
        quantity: event.quantity,
        purchase_order_id: event.purchase_order_id,
        product: {
          id: event.product_id,
          name: event.product_name,
          amount: event.product_amount,
        },
      });

      await this.repository.addPurchaseOrderItem(purchase_order_item);
    } catch (e: any) {
      console.error(e.stack);
      throw new EventHandlerError('Erro ao cadastrar o item.', { cause: e.stack });
    }
  }
}
