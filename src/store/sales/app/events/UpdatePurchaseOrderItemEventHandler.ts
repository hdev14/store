import { IPurchaseOrderRepositoryCommands } from '@sales/domain/IPurchaseOrderRepository';
import Product from '@sales/domain/Product';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import { EventData, IEventHandler } from '@shared/@types/events';
import EventHandlerError from '@shared/errors/EventHandlerError';
import { UpdatePurchaserOrderItemEventData } from './UpdatePurchaseOrderItemEvent';

export default class UpdatePurchaseOrderItemEventHandler implements IEventHandler<void> {
  private readonly repository: IPurchaseOrderRepositoryCommands;

  constructor(repository: IPurchaseOrderRepositoryCommands) {
    this.repository = repository;
  }

  public async handle(data: EventData<UpdatePurchaserOrderItemEventData>): Promise<void> {
    try {
      const purchaseOrderItem = new PurchaseOrderItem({
        id: data.principalId,
        quantity: data.quantity,
        product: new Product(
          data.productId,
          data.productName,
          data.productAmount,
        ),
      });

      await this.repository.updatePurchaseOrderItem(purchaseOrderItem);
    } catch (e: any) {
      console.error(e.stack);
      throw new EventHandlerError('Erro ao atualizar um item.', { cause: e.stack });
    }
  }
}
