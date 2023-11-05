import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import UpdatePurchaseOrderEvent from '@sales/domain/events/UpdatePurchaseOrderEvent';
import IEventQueue from '@shared/abstractions/IEventQueue';
import IHandler from '@shared/abstractions/IHandler';
import ChargePurchaseOrderEvent from '@shared/events/ChargePurchaseOrderEvent';
import PurchaseOrderNotFoundError from '../PurchaseOrderNotFoundError';
import StartPurchaseOrderCommand from '../commands/StartPurchaseOrderCommand';

// eslint-disable-next-line max-len
export default class StartPurchaseOrderCommandHandler implements IHandler<StartPurchaseOrderCommand, void> {
  constructor(
    private readonly repository: IPurchaseOrderRepository,
    private readonly event_queue: IEventQueue,
  ) { }

  public async handle(event: StartPurchaseOrderCommand): Promise<void> {
    const purchase_order = await this.repository.getPurchaseOrderById(event.purchase_order_id);

    if (!purchase_order) {
      throw new PurchaseOrderNotFoundError();
    }

    purchase_order.start();

    await this.repository.updatePurchaseOrder(purchase_order);

    this.event_queue.enqueueInBatch([
      new ChargePurchaseOrderEvent(
        purchase_order.id,
        purchase_order.customer_id,
        purchase_order.code,
        purchase_order.total_amount,
        event.card_token,
        event.installments,
        purchase_order.items.map((i) => ({
          id: i.id,
          productId: i.product.id,
          quantity: i.quantity,
        })),
      ),
      new UpdatePurchaseOrderEvent(
        purchase_order.id,
        purchase_order.customer_id,
        purchase_order.code,
        purchase_order.created_at,
        purchase_order.status,
        purchase_order.total_amount,
        purchase_order.discount_amount,
        purchase_order.voucher,
        purchase_order.items,
      ),
    ]).catch(console.error.bind(console));
  }
}
