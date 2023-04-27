import { PrismaClient } from '@prisma/client';
import Prisma from '@shared/Prisma';
import IPaymentRepository from '@payments/domain/IPaymentRepository';
import Payment, { PaymentMethods, PaymentStatus } from '@payments/domain/Payment';
import Transaction, { TransactionStatus } from '@payments/domain/Transaction';
import RepositoryError from '@shared/errors/RepositoryError';

// TODO: Finish implementation
export default class PrismaPaymentRepository implements IPaymentRepository {
  private readonly connection: PrismaClient;

  constructor() {
    this.connection = Prisma.connect();
  }

  public async getPaymentsByPurchaseOrderId(id: string): Promise<Payment[]> {
    try {
      const results = await this.connection.payment.findMany({
        where: { purchaseOrderId: id },
        include: { transactions: true },
      });

      const payments: Payment[] = [];

      for (const result of results) {
        const transactions: Transaction[] = [];

        for (const resultTransaction of result.transactions) {
          transactions.push(new Transaction({
            id: resultTransaction.id,
            details: resultTransaction.details,
            externalId: resultTransaction.externalId,
            payload: resultTransaction.payload as string,
            paymentId: resultTransaction.paymentId,
            registeredAt: resultTransaction.registeredAt,
            status: resultTransaction.status as TransactionStatus,
          }));
        }

        payments.push(new Payment({
          id: result.id,
          gateway: result.gateway,
          method: result.method as PaymentMethods,
          purchaseOrderId: result.purchaseOrderId,
          status: result.status as PaymentStatus,
          value: result.value,
          transactions,
        }));
      }

      return payments;
    } catch (error) {
      throw new RepositoryError(this.constructor.name, 'Erro ao buscar as informações dos pagamentos', {
        cause: error,
      });
    }
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
