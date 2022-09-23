import { IPurchaseOrderRepositoryCommands } from '@sales/domain/IPurchaseOrderRepository';
import { EventData, IEventHandler } from '@shared/@types/events';
import { UpdateDraftPurchaseOrderEventData } from './UpdateDraftPurchaseOrderEvent';

export default class UpdateDraftPurchaseOrderEventHandler implements IEventHandler<void> {
  private repository: IPurchaseOrderRepositoryCommands;

  constructor(repository: IPurchaseOrderRepositoryCommands) {
    this.repository = repository;
  }

  public async handle(data: EventData<UpdateDraftPurchaseOrderEventData>): Promise<void> {
    console.info(data);
    throw new Error('Method not implemented.');
  }
}
