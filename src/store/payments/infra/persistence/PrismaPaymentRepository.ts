import IPaymentRepository from '@payments/domain/IPaymentRepository';
import Payment, { PaymentMethods, PaymentStatus } from '@payments/domain/Payment';
import Transaction, { TransactionStatus } from '@payments/domain/Transaction';
import { PrismaClient, Payment as PrismaPayment, Transaction as PrismaTransaction } from '@prisma/client';
import Prisma from '@shared/Prisma';
import RepositoryError from '@shared/errors/RepositoryError';

type ResultPayment = PrismaPayment & {
  transactions: PrismaTransaction[];
};

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
        payments.push(this.mapPayment(result));
      }

      return payments;
    } catch (error) {
      throw new RepositoryError(this.constructor.name, 'Erro ao buscar as informações dos pagamentos', {
        cause: error,
      });
    }
  }

  public async getPaymentById(id: string): Promise<Payment | null> {
    try {
      const payment = await this.connection.payment.findUnique({
        where: { id },
        include: { transactions: true },
      });

      return payment ? this.mapPayment(payment) : null;
    } catch (e) {
      throw new RepositoryError(this.constructor.name, 'Erro ao buscar os dados do pagamento.', {
        cause: e,
      });
    }
  }

  public async addPayment(payment: Payment): Promise<void> {
    try {
      await this.connection.payment.create({
        data: {
          id: payment.id,
          purchaseOrderId: payment.purchase_order_id,
          value: payment.value,
          method: payment.method,
          status: payment.status,
          gateway: payment.gateway,
        },
      });
    } catch (e) {
      throw new RepositoryError(this.constructor.name, 'Erro ao cadastrar um novo pagamento', {
        cause: e,
      });
    }
  }

  public async updatePayment(payment: Payment): Promise<void> {
    try {
      await this.connection.payment.update({
        where: { id: payment.id },
        data: {
          purchaseOrderId: payment.purchase_order_id,
          value: payment.value,
          method: payment.method,
          status: payment.status,
          gateway: payment.gateway,
        },
      });
    } catch (e) {
      throw new RepositoryError(this.constructor.name, 'Erro ao atualizar um pagamento', {
        cause: e,
      });
    }
  }

  public async addTransaction(transaction: Transaction): Promise<void> {
    try {
      await this.connection.transaction.create({
        data: {
          id: transaction.id,
          externalId: transaction.external_id,
          status: transaction.status,
          details: transaction.details,
          payload: transaction.payload,
          paymentId: transaction.payment_id,
          registeredAt: transaction.registered_at,
        },
      });
    } catch (e) {
      throw new RepositoryError(this.constructor.name, 'Erro ao cadastrar um transação.', {
        cause: e,
      });
    }
  }

  private mapPayment(payment: ResultPayment) {
    const transactions: Transaction[] = [];

    for (const transaction of payment.transactions) {
      transactions.push(new Transaction({
        id: transaction.id,
        details: transaction.details,
        external_id: transaction.externalId,
        payload: transaction.payload as string,
        payment_id: transaction.paymentId,
        registered_at: transaction.registeredAt,
        status: transaction.status as TransactionStatus,
      }));
    }

    return new Payment({
      id: payment.id,
      gateway: payment.gateway,
      method: payment.method as PaymentMethods,
      purchase_order_id: payment.purchaseOrderId,
      status: payment.status as PaymentStatus,
      value: payment.value,
      transactions,
    });
  }
}
