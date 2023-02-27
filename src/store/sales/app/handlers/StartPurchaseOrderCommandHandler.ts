import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import IEventQueue from '@shared/abstractions/IEventQueue';
import IHandler from '@shared/abstractions/IHandler';
import ChargePurchaseOrderEvent from '@shared/events/ChargePurchaseOrderEvent';
import PurchaseOrderNotFoundError from '../PurchaseOrderNotFoundError';
import StartPurchaseOrderCommand from '../commands/StartPurchaseOrderCommand';

// eslint-disable-next-line max-len
export default class StartPurchaseOrderCommandHandler implements IHandler<StartPurchaseOrderCommand, void> {
  constructor(
    private readonly repository: IPurchaseOrderRepository,
    private readonly eventQueue: IEventQueue,
  ) { }

  public async handle(event: StartPurchaseOrderCommand): Promise<void> {
    const purchaseOrder = await this.repository.getPurchaseOrderById(event.purchaseOrderId);

    if (!purchaseOrder) {
      throw new PurchaseOrderNotFoundError();
    }

    purchaseOrder.start();

    await this.repository.updatePurchaseOrder(purchaseOrder);

    this.eventQueue.enqueue(new ChargePurchaseOrderEvent(
      purchaseOrder.id,
      purchaseOrder.customerId,
      purchaseOrder.code,
      purchaseOrder.totalAmount,
      event.cardToken,
      event.installments,
      purchaseOrder.items.map((i) => ({
        itemId: i.id,
        productId: i.product.id,
        quantity: i.quantity,
      })),
    )).catch(console.error.bind(console));

    // TODO: add event to update purchase order
  }
}
