import { EventData } from '@shared/@types/events';
import Command from '@shared/abstractions/Command';
import Validator from '@shared/utils/Validator';

export type AddPurchaseOrderItemData = {
  customerId: string;
  productId: string;
  productName: string;
  productAmount: number;
  quantity: number;
}

// eslint-disable-next-line max-len
export default class AddPurchaseOrderItemCommand extends Command<boolean, AddPurchaseOrderItemData> {
  public async send(data: EventData<AddPurchaseOrderItemData>): Promise<boolean | void> {
    this.validate(data);

    return this.mediator.send<boolean>(this.constructor.name, data);
  }

  public validate(data: EventData<AddPurchaseOrderItemData>): void {
    Validator.setData(data)
      .setRule('principalId', ['required', 'string', 'uuid'])
      .setRule('customerId', ['required', 'string', 'uuid'])
      .setRule('productId', ['required', 'string', 'uuid'])
      .setRule('productName', ['required', 'string'])
      .setRule('productAmount', ['required', 'number'])
      .setRule('quantity', ['required', 'number', 'min:1', 'max:10'])
      .validate();
  }
}
