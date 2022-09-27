import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import { EventData, IEventHandler } from '@shared/@types/events';
import { UpdatePurchaseOrderItemQuantityCommandData } from './UpdatePurchaseOrderItemQuantityCommand';

// eslint-disable-next-line max-len
export default class UpdatePurchaseOrderItemQuantityCommandHandler implements IEventHandler<boolean> {
  private repository: IPurchaseOrderRepository;

  constructor(repository: IPurchaseOrderRepository) {
    this.repository = repository;
  }

  public async handle(
    data: EventData<UpdatePurchaseOrderItemQuantityCommandData>,
  ): Promise<boolean> {
    try {
      const purchaseOrderItem = await this.repository.getPurchaseOrderItemById(data.principalId);

      if (!purchaseOrderItem) {
        return false;
      }

      purchaseOrderItem.updateQuantity(data.quantity);

      await this.repository.updatePurchaseOrderItem(purchaseOrderItem);

      return true;
    } catch (e: any) {
      console.error(e.stack);
      return false;
    }
  }
}
