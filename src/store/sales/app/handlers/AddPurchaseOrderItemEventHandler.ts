import Product from '@sales/domain/Product';
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
      const purchaseOrderItem = new PurchaseOrderItem({
        id: event.principalId,
        quantity: event.quantity,
        purchaseOrderId: event.purchaseOrderId,
        product: new Product(
          event.productId,
          event.productName,
          event.productAmount,
        ),
      });

      await this.repository.addPurchaseOrderItem(purchaseOrderItem);
    } catch (e: any) {
      console.error(e.stack);
      throw new EventHandlerError('Erro ao cadastrar o item.', { cause: e.stack });
    }
  }
}
