import { EventData } from '@shared/@types/events';
import Command from '@shared/abstractions/Command';
import { GenericError } from '@shared/errors/ValidationError';
import Validator from '@shared/utils/Validator';

export type AddPurchaseItemData = {
  clientId: string;
  productId: string;
  productName: string;
  productAmount: number;
  quantity: number;
}

export default class AddPurchaseItemCommand extends Command<boolean, AddPurchaseItemData> {
  private _errors: GenericError[] = [];

  get errors() {
    return this._errors;
  }

  public send(data: EventData<AddPurchaseItemData>): Promise<boolean | void> {
    console.info(data);
    return Promise.resolve(true);
  }

  public validate(data: EventData<AddPurchaseItemData>): boolean {
    const errors = Validator.setData(data)
      .setRule('clientId', ['required', 'string'])
      .setRule('productId', ['required', 'string'])
      .setRule('productName', ['required', 'string'])
      .setRule('productAmount', ['required', 'number'])
      .setRule('quantity', ['required', 'number', 'min:1', 'max:10'])
      .validate();

    if (errors.length) {
      this._errors = errors;
      return true;
    }

    return false;
  }
}
