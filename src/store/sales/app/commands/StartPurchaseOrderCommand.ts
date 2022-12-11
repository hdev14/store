import Command from '@shared/abstractions/Command';
import Validator from '@shared/utils/Validator';

export type StartPurchaseOrderData = {
  purchaseOrderId: string;
  cardToken: string;
  installments: number;
};

export default class StartPurchaseOrderCommand extends Command<boolean, StartPurchaseOrderData> {
  public validate(data: StartPurchaseOrderData): void {
    Validator.setData(data)
      .setRule('purchaseOrderId', ['string', 'uuid'])
      .setRule('cardToken', ['string'])
      .setRule('installments', ['number', 'min:1'])
      .validate();
  }
}
