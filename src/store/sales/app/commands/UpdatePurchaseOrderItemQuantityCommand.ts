import Command from '@shared/abstractions/Command';
import Validator from '@shared/utils/Validator';

export default class UpdatePurchaseOrderItemQuantityCommand extends Command {
  constructor(
    readonly purchase_order_item_id: string,
    readonly quantity: number,
  ) {
    super();
    this.validate();
  }

  protected validate(): void {
    Validator.setData(this)
      .setRule('purchase_order_item_id', ['string', 'required', 'uuid'])
      .setRule('quantity', ['number', 'integer'])
      .validate();
  }
}
