import { IPurchaseOrderRepositoryCommands } from '@sales/domain/IPurchaseOrderRepository';
import { EventData, IEventHandler } from '@shared/@types/events';

export default class RemovePurchaseOrderItemCommandHandler implements IEventHandler<boolean> {
  private readonly repository: IPurchaseOrderRepositoryCommands;

  constructor(repository: IPurchaseOrderRepositoryCommands) {
    this.repository = repository;
  }

  public async handle(data: EventData): Promise<boolean> {
    try {
      const isDeleted = await this.repository.deletePurchaseOrderItem(data.principalId);
      // TODO: add event
      return isDeleted;
    } catch (e: any) {
      console.error(e.stack);
      return false;
    }
  }
}
