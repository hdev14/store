import IPaymentGateway, { MakePaymentParams, PaymentResult } from 'src/store/payments/app/IPaymentGateway';

export default class FakePaymentGateway implements IPaymentGateway {
  public async makePayment(params: MakePaymentParams): Promise<PaymentResult> {
    console.info(params);

    const paymentStatus: any[] = [
      'paid',
      'refused',
    ];

    return Promise.resolve({
      status: paymentStatus[parseInt((Math.random() * 1).toFixed(1), 10)],
      payload: JSON.stringify({ fake: true }),
    });
  }
}
