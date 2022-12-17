import IPaymentGateway, { MakePaymentParams } from '@payment/app/IPaymentGateway';

export default class FakePaymentGateway implements IPaymentGateway {
  makePayment(params: MakePaymentParams): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
