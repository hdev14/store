import { IPurchaseOrderRepositoryCommands } from '@sales/domain/IPurchaseOrderRepository';
import IHandler from '@shared/abstractions/IHandler';
import EventPublisher from '@shared/EventPublisher';
import RemovePurchaseOrderItemEvent from '../events/RemovePurchaseOrderItemEvent';
import { RemovePurchaseOrderItemCommandData } from './RemovePurchaseOrderItemCommand';

// eslint-disable-next-line max-len
export default class RemovePurchaseOrderItemCommandHandler implements IHandler<boolean, RemovePurchaseOrderItemCommandData> {
  private readonly repository: IPurchaseOrderRepositoryCommands;

  private readonly publisher: EventPublisher;

  constructor(repository: IPurchaseOrderRepositoryCommands, publisher: EventPublisher) {
    this.repository = repository;
    this.publisher = publisher;
  }

  public async handle(data: RemovePurchaseOrderItemCommandData): Promise<boolean> {
    try {
      const isDeleted = await this.repository.deletePurchaseOrderItem(data.purchaseOrderItemId);

      if (isDeleted) {
        this.publisher.addEvent(RemovePurchaseOrderItemEvent, {
          principalId: data.purchaseOrderItemId,
          timestamp: new Date().toISOString(),
        });
      }

      return isDeleted;
    } catch (e: any) {
      console.error(e.stack);
      return false;
    }
  }
}
