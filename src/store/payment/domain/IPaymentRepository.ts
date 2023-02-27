import Payment from './Payment';
import Transaction from './Transaction';

interface IPaymentRepository {
  getPaymentsByPurchaseOrderId(id: string): Promise<Payment[]>;

  getPaymentById(id: string): Promise<Payment>;

  addPayment(payment: Payment): Promise<void>;

  updatePayment(payment: Payment): Promise<void>;

  addTransaction(transaction: Transaction): Promise<void>;
}

export default IPaymentRepository;
