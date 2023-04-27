import { faker } from '@faker-js/faker';
import { PaymentStatus, PaymentMethods } from '@payments/domain/Payment';
import { TransactionStatus } from '@payments/domain/Transaction';
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

  test.todo('PrismaPaymentRepository.getPaymentById()');

  test.todo('PrismaPaymentRepository.addPayment()');

  test.todo('PrismaPaymentRepository.updatePayment()');

  test.todo('PrismaPaymentRepository.addTransaction()');
});
