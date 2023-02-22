import Command from '@shared/abstractions/Command';
import Validator from '@shared/utils/Validator';

export default class AddPurchaseOrderItemCommand extends Command {
  constructor(
    readonly customerId: string,
    readonly productId: string,
    readonly productName: string,
    readonly productAmount: number,
    readonly quantity: number,
  ) {
    super();
    this.validate();
  }

  protected validate(): void {
    Validator.setData(this)
      .setRule('customerId', ['required', 'string', 'uuid'])
      .setRule('productId', ['required', 'string', 'uuid'])
      .setRule('productName', ['required', 'string'])
      .setRule('productAmount', ['required', 'number'])
      .setRule('quantity', ['required', 'number', 'min:1', 'max:10'])
      .validate();
  }
}
