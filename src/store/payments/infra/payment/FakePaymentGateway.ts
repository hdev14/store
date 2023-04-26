import IPaymentGateway, { MakePaymentParams } from 'src/store/payments/app/IPaymentGateway';

export default class FakePaymentGateway implements IPaymentGateway {
  public async makePayment(params: MakePaymentParams): Promise<boolean> {
    console.info(params);
    return (Math.random() * 100) < 95;
  }
}
