import { IPurchaseOrderRepositoryCommands } from '@sales/domain/IPurchaseOrderRepository';
import { EventData, IEventHandler } from '@shared/@types/events';
import { AddPurchaseOrderItemEventData } from './AddPurchaseOrderItemEvent';

export default class AddPurchaseOrderItemEventHandler implements IEventHandler<void> {
  private repository: IPurchaseOrderRepositoryCommands;

  constructor(repository: IPurchaseOrderRepositoryCommands) {
    this.repository = repository;
  }

  public async handle(data: EventData<AddPurchaseOrderItemEventData>): Promise<void> {
    console.info(data);
    throw new Error('Method not implemented.');
  }
}
