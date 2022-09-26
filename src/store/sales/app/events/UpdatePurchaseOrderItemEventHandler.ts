import { IPurchaseOrderRepositoryCommands } from '@sales/domain/IPurchaseOrderRepository';
import Product from '@sales/domain/Product';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import { EventData, IEventHandler } from '@shared/@types/events';
import { UpdatePurchaserOrderItemEventData } from './UpdatePurchaseOrderItemEvent';

export default class UpdatePurchaseOrderItemEventHandler implements IEventHandler<void> {
  private repository: IPurchaseOrderRepositoryCommands;

  constructor(repository: IPurchaseOrderRepositoryCommands) {
    this.repository = repository;
  }

  public async handle(data: EventData<UpdatePurchaserOrderItemEventData>): Promise<void> {
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
  }
}
