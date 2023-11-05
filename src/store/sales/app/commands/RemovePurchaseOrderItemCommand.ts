import Command from '@shared/abstractions/Command';
import Validator from '@shared/utils/Validator';

export default class RemovePurchaseOrderItemCommand extends Command {
  constructor(readonly purchase_order_item_id: string) {
    super();
    this.validate();
  }

  protected validate(): void {
    Validator.setData(this)
      .setRule('purchase_order_item_id', ['required', 'string', 'uuid'])
      .validate();
  }
}
