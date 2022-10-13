import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import IHandler from '@shared/abstractions/IHandler';
import EventPublisher from '@shared/EventPublisher';
import UpdatePurchaseOrderItemEvent, { UpdatePurchaserOrderItemEventData } from '../events/UpdatePurchaseOrderItemEvent';
import { UpdatePurchaseOrderItemQuantityCommandData } from './UpdatePurchaseOrderItemQuantityCommand';

// eslint-disable-next-line max-len
export default class UpdatePurchaseOrderItemQuantityCommandHandler implements IHandler<boolean, UpdatePurchaseOrderItemQuantityCommandData> {
  private readonly repository: IPurchaseOrderRepository;

  private readonly publisher: EventPublisher;

  constructor(repository: IPurchaseOrderRepository, publisher: EventPublisher) {
    this.repository = repository;
    this.publisher = publisher;
  }

  public async handle(data: UpdatePurchaseOrderItemQuantityCommandData): Promise<boolean> {
    try {
      const purchaseOrderItem = await this.repository
        .getPurchaseOrderItemById(data.purchaseOrderItemId);

      if (!purchaseOrderItem) {
        return false;
      }

      purchaseOrderItem.updateQuantity(data.quantity);

      await this.repository.updatePurchaseOrderItem(purchaseOrderItem);

      this.publisher.addEvent<UpdatePurchaserOrderItemEventData>(UpdatePurchaseOrderItemEvent, {
        principalId: purchaseOrderItem.id,
        quantity: purchaseOrderItem.quantity,
        productId: purchaseOrderItem.product.id,
        productName: purchaseOrderItem.product.name,
        productAmount: purchaseOrderItem.product.amount,
        timestamp: new Date().toISOString(),
      });

      return true;
    } catch (e: any) {
      console.error(e.stack);
      return false;
    } finally {
      await this.publisher.sendEvents();
    }
  }
}
