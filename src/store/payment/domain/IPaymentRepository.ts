/* eslint-disable no-unused-vars */
import Payment from './Payment';
import Transaction from './Transaction';

interface IPaymentRepository {
  getPaymentsByPurchaseOrderId(id: string): Promise<Payment[]>;

  getPaymentById(id: string): Promise<Payment>;

  addPayment(payment: Payment): Promise<Payment>;

  updatePayment(payment: Payment): Promise<Payment>;

  addTransaction(transaction: Transaction): Promise<Transaction>;
}

export default IPaymentRepository;
