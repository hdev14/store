import IPaymentRepository from '@payment/domain/IPaymentRepository';
import Payment from '@payment/domain/Payment';
import Transaction from '@payment/domain/Transaction';

export default class PrismaPaymentRepository implements IPaymentRepository {
  getPaymentsByPurchaseOrderId(id: string): Promise<Payment[]> {
    throw new Error('Method not implemented.');
  }

  getPaymentById(id: string): Promise<Payment> {
    throw new Error('Method not implemented.');
  }

  addPayment(payment: Payment): Promise<Payment> {
    throw new Error('Method not implemented.');
  }

  updatePayment(payment: Payment): Promise<Payment> {
    throw new Error('Method not implemented.');
  }

  addTransaction(transaction: Transaction): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }
}
