import IHandler from '@shared/abstractions/IHandler';
import { ChargePurchaseOrderData } from '@shared/events/ChargePurchaseOrderEvent';
import IPaymentGateway from './IPaymentGateway';

// eslint-disable-next-line max-len
export default class ChargePuchaseOrderEventHandler implements IHandler<void, ChargePurchaseOrderData> {
  constructor(private readonly paymentGateway: IPaymentGateway) { }

  handle(data: ChargePurchaseOrderData): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
