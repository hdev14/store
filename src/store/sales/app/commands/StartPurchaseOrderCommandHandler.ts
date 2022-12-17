import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import IHandler from '@shared/abstractions/IHandler';
import EventPublisher from '@shared/EventPublisher';
import ChargePurchaseOrderEvent, { ChargePurchaseOrderData } from '@shared/events/ChargePurchaseOrderEvent';
import { StartPurchaseOrderData } from './StartPurchaseOrderCommand';

// eslint-disable-next-line max-len
export default class StartPurchaseOrderCommandHandler implements IHandler<boolean, StartPurchaseOrderData> {
  private readonly repository: IPurchaseOrderRepository;

  private readonly publisher: EventPublisher;

  constructor(repository: IPurchaseOrderRepository, publisher: EventPublisher) {
    this.repository = repository;
    this.publisher = publisher;
  }

  public async handle(data: StartPurchaseOrderData): Promise<boolean> {
    try {
      const purchaseOrder = await this.repository.getPurchaseOrderById(data.purchaseOrderId);

      if (!purchaseOrder) {
        return false;
      }

      purchaseOrder.start();

      await this.repository.updatePurchaseOrder(purchaseOrder);

      this.publisher.addEvent<ChargePurchaseOrderData>(ChargePurchaseOrderEvent, {
        principalId: purchaseOrder.id,
        purchaseOrderId: purchaseOrder.id,
        purchaseOrderCode: purchaseOrder.code,
        customerId: purchaseOrder.customerId,
        totalAmount: purchaseOrder.totalAmount,
        items: purchaseOrder.items.map((i) => ({
          itemId: i.id,
          productId: i.product.id,
          quantity: i.quantity,
        })),
        cardToken: data.cardToken,
        installments: data.installments,
        timestamp: new Date().toISOString(),
      });

      // TODO: add event to update purchase order

      return true;
    } catch (e: any) {
      console.error(e.stack);
      return false;
    } finally {
      await this.publisher.sendEvents();
    }
  }
}
