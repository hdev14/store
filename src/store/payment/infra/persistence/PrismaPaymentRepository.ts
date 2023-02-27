import IPaymentRepository from '@payment/domain/IPaymentRepository';
import Payment from '@payment/domain/Payment';
import Transaction from '@payment/domain/Transaction';

export default class PrismaPaymentRepository implements IPaymentRepository {
  public async getPaymentsByPurchaseOrderId(id: string): Promise<Payment[]> {
    throw new Error('Method not implemented.');
  }

  public async getPaymentById(id: string): Promise<Payment> {
    throw new Error('Method not implemented.');
  }

  public async addPayment(payment: Payment): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async updatePayment(payment: Payment): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async addTransaction(transaction: Transaction): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
