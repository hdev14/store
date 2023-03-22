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
      const purchaseOrderItem = new PurchaseOrderItem({
        id: event.principalId,
        quantity: event.quantity,
        product: {
          id: event.productId,
          name: event.productName,
          amount: event.productAmount,
        },
      });

      await this.repository.updatePurchaseOrderItem(purchaseOrderItem);
    } catch (e: any) {
      console.error(e.stack);
      throw new EventHandlerError('Erro ao atualizar um item.', { cause: e.stack });
    }
  }
}
