import { EventData } from '@shared/@types/events';
import Command from '@shared/abstractions/Command';
import Validator from '@shared/utils/Validator';

export type UpdatePurchaseOrderItemQuantityCommandData = {
  quantity: number;
}

// eslint-disable-next-line max-len
export default class UpdatePurchaseOrderItemQuantityCommand extends Command<boolean, UpdatePurchaseOrderItemQuantityCommandData> {
  public send(
    data: EventData<UpdatePurchaseOrderItemQuantityCommandData>,
  ): Promise<boolean | void> {
    this.validate(data);

    return Promise.resolve(false);
  }

  public validate(data: EventData<UpdatePurchaseOrderItemQuantityCommandData>): void {
    Validator.setData(data)
      .setRule('principalId', ['string', 'required', 'uuid'])
      .setRule('quantity', ['number', 'integer'])
      .validate();
  }
}
