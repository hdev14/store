import Command from '@shared/abstractions/Command';
import Validator from '@shared/utils/Validator';

export type RemovePurchaseOrderItemCommandData = {
  purchaseOrderItemId: string;
}

// eslint-disable-next-line max-len
export default class RemovePurchaseOrderItemCommand extends Command<boolean, RemovePurchaseOrderItemCommandData> {
  public validate(data: RemovePurchaseOrderItemCommandData): void {
    Validator.setData(data)
      .setRule('purchaseOrderItemId', ['required', 'string', 'uuid'])
      .validate();
  }
}
