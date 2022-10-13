import { IPurchaseOrderRepositoryCommands } from '@sales/domain/IPurchaseOrderRepository';
import Product from '@sales/domain/Product';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import IEventHandler, { EventData } from '@shared/abstractions/IEventHandler';
import EventHandlerError from '@shared/errors/EventHandlerError';
import { AddPurchaseOrderItemEventData } from './AddPurchaseOrderItemEvent';

// eslint-disable-next-line max-len
export default class AddPurchaseOrderItemEventHandler implements IEventHandler<AddPurchaseOrderItemEventData> {
  private readonly repository: IPurchaseOrderRepositoryCommands;

  constructor(repository: IPurchaseOrderRepositoryCommands) {
    this.repository = repository;
  }

  public async handle(data: EventData<AddPurchaseOrderItemEventData>): Promise<void> {
    try {
      const purchaseOrderItem = new PurchaseOrderItem({
        id: data.principalId,
        quantity: data.quantity,
        purchaseOrderId: data.purchaseOrderId,
        product: new Product(
          data.productId,
          data.productName,
          data.productAmount,
        ),
      });

      await this.repository.addPurchaseOrderItem(purchaseOrderItem);
    } catch (e: any) {
      console.error(e.stack);
      throw new EventHandlerError('Erro ao cadastrar o item.', { cause: e.stack });
    }
  }
}
