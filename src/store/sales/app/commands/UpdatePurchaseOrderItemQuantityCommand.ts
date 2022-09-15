import { EventData } from '@shared/@types/events';
import Command from '@shared/abstractions/Command';

// TODO: finish logic
export type UpdatePurchaseOrderItemQuantityCommandData = {
  purchaseOrderItemId: string;
  quantity: number;
}

// eslint-disable-next-line max-len
export default class UpdatePurchaseOrderItemQuantityCommand extends Command<boolean, UpdatePurchaseOrderItemQuantityCommandData> {
  public send(
    data: EventData<UpdatePurchaseOrderItemQuantityCommandData>,
  ): Promise<boolean | void> {
    console.info(data);
    return Promise.resolve(false);
  }

  public validate(data: EventData<UpdatePurchaseOrderItemQuantityCommandData>): boolean | void {
    console.info(data);
    return false;
  }
}
