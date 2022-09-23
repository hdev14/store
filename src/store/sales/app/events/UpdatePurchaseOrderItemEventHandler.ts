import { IPurchaseOrderRepositoryCommands } from '@sales/domain/IPurchaseOrderRepository';
import { EventData, IEventHandler } from '@shared/@types/events';
import { UpdatePurchaserOrderItemEventData } from './UpdatePurchaseOrderItemEvent';

export default class UpdatePurchaseOrderItemEventHandler implements IEventHandler<void> {
  private repository: IPurchaseOrderRepositoryCommands;

  constructor(repository: IPurchaseOrderRepositoryCommands) {
    this.repository = repository;
  }

  handle(data: EventData<UpdatePurchaserOrderItemEventData>): Promise<void> {
    console.info(data);
    throw new Error('Method not implemented.');
  }
}
