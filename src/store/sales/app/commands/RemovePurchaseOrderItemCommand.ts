import { EventData } from '@shared/@types/events';
import Command from '@shared/abstractions/Command';

// TODO: finish logic
export type RemovePurchaseOrderItemCommandData = {
  purchaseOrderItemId: string;
}

// eslint-disable-next-line max-len
export default class RemovePurchaseOrderItemCommand extends Command<boolean, RemovePurchaseOrderItemCommandData> {
  public send(data: EventData<RemovePurchaseOrderItemCommandData>): Promise<boolean | void> {
    console.info(data);
    return Promise.resolve(false);
  }

  public validate(data: EventData<RemovePurchaseOrderItemCommandData>): boolean | void {
    console.info(data);
    return false;
  }
}
