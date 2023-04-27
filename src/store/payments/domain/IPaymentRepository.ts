import Payment from './Payment';
import Transaction from './Transaction';

interface IPaymentRepository {
  /** @throws {RepositoryError} */
  getPaymentsByPurchaseOrderId(id: string): Promise<Payment[]>;

  /** @throws {RepositoryError} */
  getPaymentById(id: string): Promise<Payment | null>;

  /** @throws {RepositoryError} */
  addPayment(payment: Payment): Promise<void>;

  /** @throws {RepositoryError} */
  updatePayment(payment: Payment): Promise<void>;

  /** @throws {RepositoryError} */
  addTransaction(transaction: Transaction): Promise<void>;
}

export default IPaymentRepository;
