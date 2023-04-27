import { faker } from '@faker-js/faker';
import Payment, { PaymentStatus, PaymentMethods } from '@payments/domain/Payment';
import Transaction, { TransactionStatus } from '@payments/domain/Transaction';
import PrismaPaymentRepository from '@payments/infra/persistence/PrismaPaymentRepository';
import { PrismaClient } from '@prisma/client';
import RepositoryError from '@shared/errors/RepositoryError';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';

const prismaMock = mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>;

jest.mock('@prisma/client/index', () => ({
  PrismaClient: jest.fn().mockImplementation(() => prismaMock),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

describe("PrismaPaymentRepository's unit tests", () => {
  const paymentRepository = new PrismaPaymentRepository();

  describe('PrismaPaymentRepository.getPaymentsByPurchaseOrderId()', () => {
    it('gets an array of payments by purchase order id', async () => {
      expect.assertions(2);

      const fakePurchaseOrderId = faker.datatype.uuid();

      const fakePayments = [1, 2, 3].map(() => ({
        id: faker.datatype.uuid(),
        purchaseOrderId: fakePurchaseOrderId,
        value: faker.datatype.float(),
        method: PaymentMethods.CREDIT_CARD,
        status: PaymentStatus.IN_PROCCESS,
        gateway: 'test',
        transactions: [
          {
            id: faker.datatype.uuid(),
            externalId: faker.datatype.uuid(),
            status: TransactionStatus.PENDING,
            details: faker.lorem.sentence(5),
            payload: faker.datatype.json(),
            paymentId: faker.datatype.uuid(),
            registeredAt: new Date(),
          },
        ],
      }));

      prismaMock.payment.findMany.mockResolvedValueOnce(fakePayments);
      const payments = await paymentRepository.getPaymentsByPurchaseOrderId(fakePurchaseOrderId);

      expect(payments).toHaveLength(3);
      expect(prismaMock.payment.findMany).toHaveBeenCalledWith({
        where: { purchaseOrderId: fakePurchaseOrderId },
        include: { transactions: true },
      });
    });

    it('throws a RepositoryError if occur an unexpected error', async () => {
      expect.assertions(1);

      const fakePurchaseOrderId = faker.datatype.uuid();
      prismaMock.payment.findMany.mockRejectedValueOnce(new Error());

      return paymentRepository.getPaymentsByPurchaseOrderId(fakePurchaseOrderId).catch((e) => {
        expect(e).toBeInstanceOf(RepositoryError);
      });
    });
  });

  describe('PrismaPaymentRepository.getPaymentById()', () => {
    it('gets a payment', async () => {
      expect.assertions(2);

      const fakePaymentId = faker.datatype.uuid();

      const fakePayment = {
        id: fakePaymentId,
        purchaseOrderId: faker.datatype.uuid(),
        value: faker.datatype.float(),
        method: PaymentMethods.CREDIT_CARD,
        status: PaymentStatus.IN_PROCCESS,
        gateway: 'test',
        transactions: [
          {
            id: faker.datatype.uuid(),
            externalId: faker.datatype.uuid(),
            status: TransactionStatus.PENDING,
            details: faker.lorem.sentence(5),
            payload: faker.datatype.json(),
            paymentId: faker.datatype.uuid(),
            registeredAt: new Date(),
          },
        ],
      };

      prismaMock.payment.findUnique.mockResolvedValueOnce(fakePayment);

      const payment = await paymentRepository.getPaymentById(fakePaymentId);

      expect(prismaMock.payment.findUnique).toHaveBeenCalledWith({
        where: { id: fakePaymentId },
        include: { transactions: true },
      });
      expect(payment).toEqual(fakePayment);
    });

    it("returns null if payment doesn't exist", async () => {
      expect.assertions(1);

      const fakePaymentId = faker.datatype.uuid();

      prismaMock.payment.findUnique.mockResolvedValueOnce(null);

      const payment = await paymentRepository.getPaymentById(fakePaymentId);

      expect(payment).toBeNull();
    });

    it('throws a RepositoryError if occur an unexpected error', async () => {
      expect.assertions(1);

      const fakePaymentId = faker.datatype.uuid();

      prismaMock.payment.findUnique.mockRejectedValueOnce(new Error('test'));

      return paymentRepository.getPaymentById(fakePaymentId).catch((e) => {
        expect(e).toBeInstanceOf(RepositoryError);
      });
    });
  });

  describe('PrismaPaymentRepository.addPayment()', () => {
    it('creates a new payment', async () => {
      expect.assertions(1);

      const payment = new Payment({
        id: faker.datatype.uuid(),
        purchaseOrderId: faker.datatype.uuid(),
        value: faker.datatype.float(),
        method: PaymentMethods.CREDIT_CARD,
        status: PaymentStatus.IN_PROCCESS,
        gateway: 'test',
        transactions: [
          {
            id: faker.datatype.uuid(),
            externalId: faker.datatype.uuid(),
            status: TransactionStatus.PENDING,
            details: faker.lorem.sentence(5),
            payload: faker.datatype.json(),
            paymentId: faker.datatype.uuid(),
            registeredAt: new Date(),
          },
        ],
      });

      await paymentRepository.addPayment(payment);

      expect(prismaMock.payment.create).toHaveBeenCalledWith({
        data: {
          id: payment.id,
          purchaseOrderId: payment.purchaseOrderId,
          value: payment.value,
          method: payment.method,
          status: payment.status,
          gateway: payment.gateway,
        },
      });
    });

    it('throws a RepositoryError if occur an unexpected error', async () => {
      expect.assertions(1);

      const payment = new Payment({
        id: faker.datatype.uuid(),
        purchaseOrderId: faker.datatype.uuid(),
        value: faker.datatype.float(),
        method: PaymentMethods.CREDIT_CARD,
        status: PaymentStatus.IN_PROCCESS,
        gateway: 'test',
        transactions: [
          {
            id: faker.datatype.uuid(),
            externalId: faker.datatype.uuid(),
            status: TransactionStatus.PENDING,
            details: faker.lorem.sentence(5),
            payload: faker.datatype.json(),
            paymentId: faker.datatype.uuid(),
            registeredAt: new Date(),
          },
        ],
      });

      prismaMock.payment.create.mockRejectedValueOnce(new Error('test'));

      return paymentRepository.addPayment(payment).catch((e) => {
        expect(e).toBeInstanceOf(RepositoryError);
      });
    });
  });

  describe('PrismaPaymentRepository.updatePayment()', () => {
    it('updates a payment', async () => {
      expect.assertions(1);

      const payment = new Payment({
        id: faker.datatype.uuid(),
        purchaseOrderId: faker.datatype.uuid(),
        value: faker.datatype.float(),
        method: PaymentMethods.CREDIT_CARD,
        status: PaymentStatus.IN_PROCCESS,
        gateway: 'test',
        transactions: [
          {
            id: faker.datatype.uuid(),
            externalId: faker.datatype.uuid(),
            status: TransactionStatus.PENDING,
            details: faker.lorem.sentence(5),
            payload: faker.datatype.json(),
            paymentId: faker.datatype.uuid(),
            registeredAt: new Date(),
          },
        ],
      });

      await paymentRepository.updatePayment(payment);

      expect(prismaMock.payment.update).toHaveBeenCalledWith({
        where: { id: payment.id },
        data: {
          purchaseOrderId: payment.purchaseOrderId,
          value: payment.value,
          method: payment.method,
          status: payment.status,
          gateway: payment.gateway,
        },
      });
    });

    it('throws a RepositoryError if occur an unexpected error', async () => {
      expect.assertions(1);

      const payment = new Payment({
        id: faker.datatype.uuid(),
        purchaseOrderId: faker.datatype.uuid(),
        value: faker.datatype.float(),
        method: PaymentMethods.CREDIT_CARD,
        status: PaymentStatus.IN_PROCCESS,
        gateway: 'test',
        transactions: [
          {
            id: faker.datatype.uuid(),
            externalId: faker.datatype.uuid(),
            status: TransactionStatus.PENDING,
            details: faker.lorem.sentence(5),
            payload: faker.datatype.json(),
            paymentId: faker.datatype.uuid(),
            registeredAt: new Date(),
          },
        ],
      });

      prismaMock.payment.update.mockRejectedValueOnce(new Error('test'));

      return paymentRepository.updatePayment(payment).catch((e) => {
        expect(e).toBeInstanceOf(RepositoryError);
      });
    });
  });

  describe('PrismaPaymentRepository.addTransaction()', () => {
    it('creates a new transaction', async () => {
      expect.assertions(1);

      const transaction = new Transaction({
        id: faker.datatype.uuid(),
        externalId: faker.datatype.uuid(),
        status: TransactionStatus.PENDING,
        details: faker.lorem.sentence(5),
        payload: faker.datatype.json(),
        paymentId: faker.datatype.uuid(),
        registeredAt: new Date(),
      });

      await paymentRepository.addTransaction(transaction);

      expect(prismaMock.transaction.create).toHaveBeenCalledWith({
        data: {
          id: transaction.id,
          externalId: transaction.externalId,
          status: transaction.status,
          details: transaction.details,
          payload: transaction.payload,
          paymentId: transaction.paymentId,
          registeredAt: transaction.registeredAt,
        },
      });
    });

    it('throws a RepositoryError if occur an unexpected error', async () => {
      expect.assertions(1);

      const transaction = new Transaction({
        id: faker.datatype.uuid(),
        externalId: faker.datatype.uuid(),
        status: TransactionStatus.PENDING,
        details: faker.lorem.sentence(5),
        payload: faker.datatype.json(),
        paymentId: faker.datatype.uuid(),
        registeredAt: new Date(),
      });

      prismaMock.transaction.create.mockRejectedValueOnce(new Error('test'));

      return paymentRepository.addTransaction(transaction).catch((e) => {
        expect(e).toBeInstanceOf(RepositoryError);
      });
    });
  });
});
