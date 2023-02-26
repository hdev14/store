import UpdatePurchaseOrderItemEvent from '@sales/domain/events/UpdatePurchaseOrderItemEvent';
import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import IEventQueue from '@shared/abstractions/IEventQueue';
import IHandler from '@shared/abstractions/IHandler';
import PurchaseOrderItemNotFoundError from '../PurchaseOrderItemNotFoundError';
import UpdatePurchaseOrderItemQuantityCommand from './UpdatePurchaseOrderItemQuantityCommand';

// eslint-disable-next-line max-len
export default class UpdatePurchaseOrderItemQuantityCommandHandler implements IHandler<UpdatePurchaseOrderItemQuantityCommand, void> {
  constructor(
    private readonly repository: IPurchaseOrderRepository,
    private readonly eventQueue: IEventQueue,
  ) { }

  public async handle(event: UpdatePurchaseOrderItemQuantityCommand): Promise<void> {
    const purchaseOrderItem = await this.repository
      .getPurchaseOrderItemById(event.purchaseOrderItemId);

    if (!purchaseOrderItem) {
      throw new PurchaseOrderItemNotFoundError();
    }

    purchaseOrderItem.updateQuantity(event.quantity);

    await this.repository.updatePurchaseOrderItem(purchaseOrderItem);

    this.eventQueue.enqueue(new UpdatePurchaseOrderItemEvent(
      purchaseOrderItem.id,
      purchaseOrderItem.quantity,
      purchaseOrderItem.product.id,
      purchaseOrderItem.product.name,
      purchaseOrderItem.product.amount,
    )).catch(console.error.bind(console));
  }
}
