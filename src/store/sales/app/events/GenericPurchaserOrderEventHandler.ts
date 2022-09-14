import { IEventHandler, EventData } from '@shared/@types/events';
import { AddDraftPurchaseOrderEventData } from './AddDraftPurchaseOrderEvent';
import { AddPurchaseOrderItemEventData } from './AddPurchaseOrderItemEvent';
import { UpdateDraftPurchaseOrderEventData } from './UpdateDraftPurchaseOrderEvent';
import { UpdatePurchaserOrderItemEventData } from './UpdatePurchaseOrderItemEvent';

export default class GenericPurchaseOrderEventHandler implements IEventHandler<void> {
  handle(data: EventData<
    AddDraftPurchaseOrderEventData |
    UpdateDraftPurchaseOrderEventData |
    AddPurchaseOrderItemEventData |
    UpdatePurchaserOrderItemEventData
  >): Promise<void> {
    console.info(data);
    return Promise.resolve();
  }
}
