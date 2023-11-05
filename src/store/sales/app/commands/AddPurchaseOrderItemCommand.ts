import Command from '@shared/abstractions/Command';
import Validator from '@shared/utils/Validator';

export default class AddPurchaseOrderItemCommand extends Command {
  constructor(
    readonly customer_id: string,
    readonly product_id: string,
    readonly product_name: string,
    readonly product_amount: number,
    readonly quantity: number,
  ) {
    super();
    this.validate();
  }

  protected validate(): void {
    Validator.setData(this)
      .setRule('customer_id', ['required', 'string', 'uuid'])
      .setRule('product_id', ['required', 'string', 'uuid'])
      .setRule('product_name', ['required', 'string'])
      .setRule('product_amount', ['required', 'number'])
      .setRule('quantity', ['required', 'number', 'min:1', 'max:10'])
      .validate();
  }
}
