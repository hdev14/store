import IHandler from '@shared/abstractions/IHandler';
import ChargePurchaseOrderEvent from '@shared/events/ChargePurchaseOrderEvent';

import IPaymentGateway from './IPaymentGateway';

export default class ChargePuchaseOrderEventHandler implements IHandler<ChargePurchaseOrderEvent> {
  constructor(private readonly paymentGateway: IPaymentGateway) { }

  public async handle(event: ChargePurchaseOrderEvent): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
