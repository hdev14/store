import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import IHandler from '@shared/abstractions/IHandler';
import PurchaseOrderNotFoundError from '../PurchaseOrderNotFoundError';
import StartPurchaseOrderCommand from './StartPurchaseOrderCommand';

// eslint-disable-next-line max-len
export default class StartPurchaseOrderCommandHandler implements IHandler<StartPurchaseOrderCommand, void> {
  constructor(
    private readonly repository: IPurchaseOrderRepository,
  ) { }

  public async handle(event: StartPurchaseOrderCommand): Promise<void> {
    const purchaseOrder = await this.repository.getPurchaseOrderById(event.purchaseOrderId);

    if (!purchaseOrder) {
      throw new PurchaseOrderNotFoundError();
    }

    purchaseOrder.start();

    await this.repository.updatePurchaseOrder(purchaseOrder);

    // this.publisher.addEvent<ChargePurchaseOrderData>(ChargePurchaseOrderEvent, {
    //   principalId: purchaseOrder.id,
    //   purchaseOrderId: purchaseOrder.id,
    //   purchaseOrderCode: purchaseOrder.code,
    //   customerId: purchaseOrder.customerId,
    //   totalAmount: purchaseOrder.totalAmount,
    //   items: purchaseOrder.items.map((i) => ({
    //     itemId: i.id,
    //     productId: i.product.id,
    //     quantity: i.quantity,
    //   })),
    //   cardToken: event.cardToken,
    //   installments: event.installments,
    //   timestamp: new Date().toISOString(),
    // });

    // TODO: add event to update purchase order
  }
}
