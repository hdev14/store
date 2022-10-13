import Command from '@shared/abstractions/Command';
import Validator from '@shared/utils/Validator';

export type UpdatePurchaseOrderItemQuantityCommandData = {
  purchaseOrderItemId: string;
  quantity: number;
}

// eslint-disable-next-line max-len
export default class UpdatePurchaseOrderItemQuantityCommand extends Command<boolean, UpdatePurchaseOrderItemQuantityCommandData> {
  public send(data: UpdatePurchaseOrderItemQuantityCommandData): Promise<boolean | void> {
    this.validate(data);

    return this.mediator.send(this.constructor.name, data);
  }

  public validate(data: UpdatePurchaseOrderItemQuantityCommandData): void {
    Validator.setData(data)
      .setRule('purchaseOrderItemId', ['string', 'required', 'uuid'])
      .setRule('quantity', ['number', 'integer'])
      .validate();
  }
}
