import Command from '@shared/abstractions/Command';
import Validator from '@shared/utils/Validator';

export default class UpdatePurchaseOrderItemQuantityCommand extends Command {
  constructor(
    readonly purchaseOrderItemId: string,
    readonly quantity: number,
  ) {
    super();
    this.validate();
  }

  protected validate(): void {
    Validator.setData(this)
      .setRule('purchaseOrderItemId', ['string', 'required', 'uuid'])
      .setRule('quantity', ['number', 'integer'])
      .validate();
  }
}
