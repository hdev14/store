import { IPurchaseOrderRepositoryCommands } from '@sales/domain/IPurchaseOrderRepository';
import Product from '@sales/domain/Product';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import { EventData, IEventHandler } from '@shared/@types/events';
import { AddPurchaseOrderItemEventData } from './AddPurchaseOrderItemEvent';

export default class AddPurchaseOrderItemEventHandler implements IEventHandler<void> {
  private repository: IPurchaseOrderRepositoryCommands;

  constructor(repository: IPurchaseOrderRepositoryCommands) {
    this.repository = repository;
  }

  public async handle(data: EventData<AddPurchaseOrderItemEventData>): Promise<void> {
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
  }
}
