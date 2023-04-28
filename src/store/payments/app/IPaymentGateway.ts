import { TransactionStatus } from '@payments/domain/Transaction';
import Payment from 'src/store/payments/domain/Payment';

// eslint-disable-next-line no-shadow
export enum PaymentTypes {
  CREDIT_CARD,
}

export type Item = {
  id: string;
  productId: string;
  quantity: number;
}

export type MakePaymentParams = {
  type: PaymentTypes,
  customerId: string;
  items: Item[];
  payment: Payment
}

export type PaymentResult = {
  status: TransactionStatus,
  payload: string;
}

interface IPaymentGateway {
  makePayment(params: MakePaymentParams): Promise<PaymentResult>;
}

export default IPaymentGateway;
