import Payment from 'src/store/payments/domain/Payment';

export type Item = {
  productName: string;
  quantity: number;
}

export type Customer = {
  name: string;
  email: string;
  phone: string;
  document: string;
}

export type MakePaymentParams = {
  items: Item[];
  customer: Customer;
  payment: Payment
}

interface IPaymentGateway {
  makePayment(params: MakePaymentParams): Promise<boolean>;
}

export default IPaymentGateway;
