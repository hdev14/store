import RemovePurchaseOrderItemEvent from '@sales/domain/events/RemovePurchaseOrderItemEvent';
import { IPurchaseOrderRepositoryCommands } from '@sales/domain/IPurchaseOrderRepository';
import IEventQueue from '@shared/abstractions/IEventQueue';
import IHandler from '@shared/abstractions/IHandler';
import PurchaseOrderItemNotDeletedError from '../PurchaseOrderItemNotDeletedError.ts';
import RemovePurchaseOrderItemCommand from '../commands/RemovePurchaseOrderItemCommand';

// eslint-disable-next-line max-len
export default class RemovePurchaseOrderItemCommandHandler implements IHandler<RemovePurchaseOrderItemCommand, void> {
  constructor(
    private readonly repository: IPurchaseOrderRepositoryCommands,
    private readonly eventQueue: IEventQueue,
  ) { }

  public async handle(event: RemovePurchaseOrderItemCommand): Promise<void> {
    try {
      await this.repository.deletePurchaseOrderItem(event.purchaseOrderItemId);

      this.eventQueue
        .enqueue(new RemovePurchaseOrderItemEvent(event.purchaseOrderItemId))
        .catch(console.error.bind(console));
    } catch (e: any) {
      console.error(e.stack);
      throw new PurchaseOrderItemNotDeletedError();
    }
  }
}
