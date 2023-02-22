import Command from '@shared/abstractions/Command';
import Validator from '@shared/utils/Validator';

export default class StartPurchaseOrderCommand extends Command {
  constructor(
    readonly purchaseOrderId: string,
    readonly cardToken: string,
    readonly installments: number,
  ) {
    super();
    this.validate();
  }

  protected validate(): void {
    Validator.setData(this)
      .setRule('purchaseOrderId', ['string', 'uuid'])
      .setRule('cardToken', ['string'])
      .setRule('installments', ['number', 'min:1'])
      .validate();
  }
}
