import Command from '@shared/abstractions/Command';
import Validator from '@shared/utils/Validator';

export default class StartPurchaseOrderCommand extends Command {
  constructor(
    readonly purchase_order_id: string,
    readonly card_token: string,
    readonly installments: number,
  ) {
    super();
    this.validate();
  }

  protected validate(): void {
    Validator.setData(this)
      .setRule('purchase_order_id', ['string', 'uuid'])
      .setRule('card_token', ['string'])
      .setRule('installments', ['number', 'min:1'])
      .validate();
  }
}
