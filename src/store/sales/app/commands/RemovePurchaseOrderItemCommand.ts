import Command from '@shared/abstractions/Command';
import Validator from '@shared/utils/Validator';

export default class RemovePurchaseOrderItemCommand extends Command {
  constructor(readonly purchaseOrderItemId: string) {
    super();
    this.validate();
  }

  protected validate(): void {
    Validator.setData(this)
      .setRule('purchaseOrderItemId', ['required', 'string', 'uuid'])
      .validate();
  }
}
