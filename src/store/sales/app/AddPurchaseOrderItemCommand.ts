import { EventData } from '@shared/@types/events';
import Command from '@shared/abstractions/Command';
import Validator from '@shared/utils/Validator';

export type AddPurchaseOrderItemData = {
  clientId: string;
  productId: string;
  productName: string;
  productAmount: number;
  quantity: number;
}

// eslint-disable-next-line max-len
export default class AddPurchaseOrderItemCommand extends Command<boolean, AddPurchaseOrderItemData> {
  public async send(data: EventData<AddPurchaseOrderItemData>): Promise<boolean | void> {
    this.validate(data);

    const result = await this.mediator.send<boolean>(this.constructor.name, data);

    return result;
  }

  public validate(data: EventData<AddPurchaseOrderItemData>): void {
    Validator.setData(data)
      .setRule('principalId', ['required', 'string', 'uuid'])
      .setRule('clientId', ['required', 'string', 'uuid'])
      .setRule('productId', ['required', 'string', 'uuid'])
      .setRule('productName', ['required', 'string'])
      .setRule('productAmount', ['required', 'number'])
      .setRule('quantity', ['required', 'number', 'min:1', 'max:10'])
      .validate();
  }
}
