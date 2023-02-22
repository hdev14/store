import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import IHandler from '@shared/abstractions/IHandler';
import PurchaseOrderItemNotFoundError from '../PurchaseOrderItemNotFoundError';
import UpdatePurchaseOrderItemQuantityCommand from './UpdatePurchaseOrderItemQuantityCommand';

// eslint-disable-next-line max-len
export default class UpdatePurchaseOrderItemQuantityCommandHandler implements IHandler<UpdatePurchaseOrderItemQuantityCommand, void> {
  constructor(
    private readonly repository: IPurchaseOrderRepository,
  ) { }

  public async handle(event: UpdatePurchaseOrderItemQuantityCommand): Promise<void> {
    const purchaseOrderItem = await this.repository
      .getPurchaseOrderItemById(event.purchaseOrderItemId);

    if (!purchaseOrderItem) {
      throw new PurchaseOrderItemNotFoundError();
    }

    purchaseOrderItem.updateQuantity(event.quantity);

    await this.repository.updatePurchaseOrderItem(purchaseOrderItem);

    // this.publisher.addEvent<UpdatePurchaserOrderItemEventData>(UpdatePurchaseOrderItemEvent, {
    //   principalId: purchaseOrderItem.id,
    //   quantity: purchaseOrderItem.quantity,
    //   productId: purchaseOrderItem.product.id,
    //   productName: purchaseOrderItem.product.name,
    //   productAmount: purchaseOrderItem.product.amount,
    //   timestamp: new Date().toISOString(),
    // });
  }
}
