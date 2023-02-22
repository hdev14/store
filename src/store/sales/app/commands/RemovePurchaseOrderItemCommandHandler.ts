import { IPurchaseOrderRepositoryCommands } from '@sales/domain/IPurchaseOrderRepository';
import IHandler from '@shared/abstractions/IHandler';
import PurchaseOrderItemNotDeletedError from '../PurchaseOrderItemNotDeletedError.ts';
import RemovePurchaseOrderItemCommand from './RemovePurchaseOrderItemCommand';

// eslint-disable-next-line max-len
export default class RemovePurchaseOrderItemCommandHandler implements IHandler<RemovePurchaseOrderItemCommand, void> {
  constructor(
    private readonly repository: IPurchaseOrderRepositoryCommands,
  ) { }

  public async handle(event: RemovePurchaseOrderItemCommand): Promise<void> {
    const isDeleted = await this.repository.deletePurchaseOrderItem(event.purchaseOrderItemId);

    if (!isDeleted) {
      throw new PurchaseOrderItemNotDeletedError();
    }

    // this.publisher.addEvent(RemovePurchaseOrderItemEvent, {
    //   principalId: event.purchaseOrderItemId,
    //   timestamp: new Date().toISOString(),
    // });
  }
}
