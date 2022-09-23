import { EventData, IEventHandler } from '@shared/@types/events';
import { AddDraftPurchaseOrderEventData } from './AddDraftPurchaseOrderEvent';

export default class AddDraftPurchaseOrderEventHandler implements IEventHandler<void> {
  handle(data: EventData<AddDraftPurchaseOrderEventData>): Promise<void> {
    console.info(data);
    throw new Error('Method not implemented.');
  }
}
