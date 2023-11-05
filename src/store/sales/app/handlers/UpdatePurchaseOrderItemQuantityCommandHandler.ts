import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import UpdatePurchaseOrderItemEvent from '@sales/domain/events/UpdatePurchaseOrderItemEvent';
import IEventQueue from '@shared/abstractions/IEventQueue';
import IHandler from '@shared/abstractions/IHandler';
import PurchaseOrderItemNotFoundError from '../PurchaseOrderItemNotFoundError';
import UpdatePurchaseOrderItemQuantityCommand from '../commands/UpdatePurchaseOrderItemQuantityCommand';

// eslint-disable-next-line max-len
export default class UpdatePurchaseOrderItemQuantityCommandHandler implements IHandler<UpdatePurchaseOrderItemQuantityCommand, void> {
  constructor(
    private readonly repository: IPurchaseOrderRepository,
    private readonly event_queue: IEventQueue,
  ) { }

  public async handle(event: UpdatePurchaseOrderItemQuantityCommand): Promise<void> {
    const purchase_order_item = await this.repository
      .getPurchaseOrderItemById(event.purchase_order_item_id);

    if (!purchase_order_item) {
      throw new PurchaseOrderItemNotFoundError();
    }

    purchase_order_item.updateQuantity(event.quantity);

    await this.repository.updatePurchaseOrderItem(purchase_order_item);

    this.event_queue.enqueue(new UpdatePurchaseOrderItemEvent(
      purchase_order_item.id,
      purchase_order_item.quantity,
      purchase_order_item.product.id,
      purchase_order_item.product.name,
      purchase_order_item.product.amount,
    )).catch(console.error.bind(console));
  }
}
