import {
    ProductModel, PurchaseOrderItemModel, PurchaseOrderModel, VoucherModel,
} from '@db/mongoose/models';
import { faker } from '@faker-js/faker';
import Product from '@sales/domain/Product';
import PurchaseOrder, { PurchaseOrderStatus } from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import { VoucherDiscountTypes } from '@sales/domain/Voucher';
import MongoosePurchaseOrderRepository from '@sales/infra/persistence/MongoosePurchaseOrderRepository';
import RepositoryError from '@shared/errors/RepositoryError';

jest.mock('../../../../db/mongoose/models/PurchaseOrderModel');
jest.mock('../../../../db/mongoose/models/PurchaseOrderItemModel');
jest.mock('../../../../db/mongoose/models/VoucherModel');
jest.mock('../../../../db/mongoose/models/ProductModel');
jest.mock('../../../../db/mongoose/models/UserModel');

const PurchaseOrderModelMock = jest.mocked(PurchaseOrderModel);
const PurchaseOrderItemModelMock = jest.mocked(PurchaseOrderItemModel);
const VoucherModelMock = jest.mocked(VoucherModel);

describe("MongoosePurchaseOrderRepository's unit tests", () => {
  const repository = new MongoosePurchaseOrderRepository();

  describe('MongoosePurchaseOrderRepository.getPurchaseOrderById()', () => {
    beforeEach(() => {
      PurchaseOrderModelMock.findOne.mockClear();
    });

    it('returns a purchase order by id', async () => {
      expect.assertions(29);

      const purchaseOrderId = faker.datatype.uuid();

      const fakePurchaseOrder = {
        _id: purchaseOrderId,
        customer: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        status: PurchaseOrderStatus.STARTED,
        totalAmount: faker.datatype.float(),
        discountAmount: 0,
        createdAt: new Date(),
        voucher: {
          _id: faker.datatype.uuid(),
          percentageAmount: 0,
          rawDiscountAmount: 0,
          quantity: parseInt(faker.datatype.number().toString(), 10),
          type: VoucherDiscountTypes.ABSOLUTE,
          active: faker.datatype.boolean(),
          code: parseInt(faker.datatype.number().toString(), 10),
          expiresAt: new Date(),
          createdAt: new Date(),
        },
        items: [
          {
            _id: faker.datatype.uuid(),
            quantity: parseInt(faker.datatype.number().toString(), 10),
            purchaseOrder: purchaseOrderId,
            product: {
              _id: faker.datatype.uuid(),
              name: faker.commerce.product(),
              amount: faker.datatype.float(),
            },
          },
          {
            _id: faker.datatype.uuid(),
            quantity: parseInt(faker.datatype.number().toString(), 10),
            purchaseOrder: purchaseOrderId,
            product: {
              _id: faker.datatype.uuid(),
              name: faker.commerce.product(),
              amount: faker.datatype.float(),
            },
          },
        ],
      };

      const populateItemsMock = jest.fn()
        .mockImplementation(() => Promise.resolve(fakePurchaseOrder as any));

      const populateVoucherMock = jest.fn()
        .mockImplementation(() => ({ populate: populateItemsMock } as any));

      PurchaseOrderModelMock.findOne
        .mockImplementationOnce(() => ({ populate: populateVoucherMock } as any));

      const purchaseOrder = await repository.getPurchaseOrderById(purchaseOrderId);

      expect(purchaseOrder!.id).toEqual(fakePurchaseOrder._id);
      expect(purchaseOrder!.customer_id).toEqual(fakePurchaseOrder.customer);
      expect(purchaseOrder!.code).toEqual(fakePurchaseOrder.code);
      expect(purchaseOrder!.created_at).toEqual(fakePurchaseOrder.createdAt);
      expect(purchaseOrder!.discount_amount).toEqual(fakePurchaseOrder.discountAmount);
      expect(purchaseOrder!.voucher!.id).toEqual(fakePurchaseOrder.voucher._id);
      expect(purchaseOrder!.voucher!.active).toEqual(fakePurchaseOrder.voucher.active);
      expect(purchaseOrder!.voucher!.code).toEqual(fakePurchaseOrder.voucher.code);
      expect(purchaseOrder!.voucher!.type).toEqual(fakePurchaseOrder.voucher.type);
      expect(purchaseOrder!.voucher!.percentage_amount)
        .toEqual(fakePurchaseOrder.voucher.percentageAmount);
      expect(purchaseOrder!.voucher!.raw_discount_amount)
        .toEqual(fakePurchaseOrder.voucher.rawDiscountAmount);
      expect(purchaseOrder!.voucher!.created_at).toEqual(fakePurchaseOrder.voucher.createdAt);
      expect(purchaseOrder!.voucher!.expires_at).toEqual(fakePurchaseOrder.voucher.expiresAt);
      expect(purchaseOrder!.voucher!.usedAt).toEqual(null);

      for (let i = 0, len = purchaseOrder!.items.length; i < len; i += 1) {
        const item = purchaseOrder!.items[i];

        expect(item.id).toEqual(fakePurchaseOrder.items[i]._id);
        expect(item.product.id).toEqual(fakePurchaseOrder.items[i].product._id);
        expect(item.product.name).toEqual(fakePurchaseOrder.items[i].product.name);
        expect(item.product.amount).toEqual(fakePurchaseOrder.items[i].product.amount);
        expect(item.quantity).toEqual(fakePurchaseOrder.items[i].quantity);
        expect(item.purchase_order_id).toEqual(fakePurchaseOrder.items[i].purchaseOrder);
      }

      expect(PurchaseOrderModelMock.findOne).toHaveBeenCalledWith({ _id: purchaseOrderId });
      expect(populateVoucherMock).toHaveBeenCalledWith({ path: 'voucher', model: VoucherModel });
      expect(populateItemsMock).toHaveBeenCalledWith({
        path: 'items',
        model: PurchaseOrderItemModel,
        populate: {
          path: 'product',
          select: '_id name amount',
          model: ProductModel,
        },
      });
    });

    it('throws a RepositoryError if occur an unexpected error', () => {
      expect.assertions(2);

      const purchaseOrderId = faker.datatype.uuid();

      PurchaseOrderModelMock.findOne.mockImplementationOnce(() => {
        throw new Error('test');
      });

      return repository.getPurchaseOrderById(purchaseOrderId).catch((e: any) => {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('MongoosePurchaseOrderRepository - test');
      });
    });
  });

  describe('MongoosePurchaseOrderRepository.getPurchaseOrdersByCustomerId()', () => {
    beforeEach(() => {
      PurchaseOrderModelMock.find.mockClear();
    });

    it('returns purchase orders by customer id', async () => {
      expect.assertions(30);

      const customerId = faker.datatype.uuid();
      const purchaseOrderId = faker.datatype.uuid();

      const fakePurchaseOrders = [{
        _id: purchaseOrderId,
        customer: customerId,
        code: parseInt(faker.datatype.number().toString(), 10),
        status: PurchaseOrderStatus.STARTED,
        totalAmount: faker.datatype.float(),
        discountAmount: 0,
        createdAt: new Date(),
        voucher: {
          _id: faker.datatype.uuid(),
          percentageAmount: 0,
          rawDiscountAmount: 0,
          quantity: parseInt(faker.datatype.number().toString(), 10),
          type: VoucherDiscountTypes.ABSOLUTE,
          active: faker.datatype.boolean(),
          code: parseInt(faker.datatype.number().toString(), 10),
          expiresAt: new Date(),
          createdAt: new Date(),
        },
        items: [
          {
            _id: faker.datatype.uuid(),
            quantity: parseInt(faker.datatype.number().toString(), 10),
            purchaseOrder: purchaseOrderId,
            product: {
              _id: faker.datatype.uuid(),
              name: faker.commerce.product(),
              amount: faker.datatype.float(),
            },
          },
          {
            _id: faker.datatype.uuid(),
            quantity: parseInt(faker.datatype.number().toString(), 10),
            purchaseOrder: purchaseOrderId,
            product: {
              _id: faker.datatype.uuid(),
              name: faker.commerce.product(),
              amount: faker.datatype.float(),
            },
          },
        ],
      }];

      const populateItemsMock = jest.fn()
        .mockImplementation(() => Promise.resolve(fakePurchaseOrders as any));

      const populateVoucherMock = jest.fn()
        .mockImplementation(() => ({ populate: populateItemsMock } as any));

      PurchaseOrderModelMock.find
        .mockImplementationOnce(() => ({ populate: populateVoucherMock } as any));

      const purchaseOrders = await repository.getPurchaseOrdersByCustomerId(customerId);

      for (let i = 0, poLength = purchaseOrders.length; i < poLength; i += 1) {
        const purchaseOrder = purchaseOrders[i];

        expect(purchaseOrder.id).toEqual(fakePurchaseOrders[i]._id);
        expect(purchaseOrder.customer_id).toEqual(fakePurchaseOrders[i].customer);
        expect(purchaseOrder.code).toEqual(fakePurchaseOrders[i].code);
        expect(purchaseOrder.created_at).toEqual(fakePurchaseOrders[i].createdAt);
        expect(purchaseOrder.discount_amount).toEqual(fakePurchaseOrders[i].discountAmount);
        expect(purchaseOrder.voucher!.id).toEqual(fakePurchaseOrders[i].voucher._id);
        expect(purchaseOrder.voucher!.active).toEqual(fakePurchaseOrders[i].voucher.active);
        expect(purchaseOrder.voucher!.code).toEqual(fakePurchaseOrders[i].voucher.code);
        expect(purchaseOrder.voucher!.type).toEqual(fakePurchaseOrders[i].voucher.type);
        expect(purchaseOrder.voucher!.percentage_amount)
          .toEqual(fakePurchaseOrders[i].voucher.percentageAmount);
        expect(purchaseOrder!.voucher!.raw_discount_amount)
          .toEqual(fakePurchaseOrders[i].voucher.rawDiscountAmount);
        expect(purchaseOrder!.voucher!.created_at)
          .toEqual(fakePurchaseOrders[i].voucher.createdAt);
        expect(purchaseOrder!.voucher!.expires_at)
          .toEqual(fakePurchaseOrders[i].voucher.expiresAt);
        expect(purchaseOrder!.voucher!.usedAt).toEqual(null);

        for (let h = 0, iLength = purchaseOrder.items.length; h < iLength; h += 1) {
          const item = purchaseOrder.items[h];

          expect(item.id).toEqual(fakePurchaseOrders[i].items[h]._id);
          expect(item.product.id).toEqual(fakePurchaseOrders[i].items[h].product._id);
          expect(item.product.name).toEqual(fakePurchaseOrders[i].items[h].product.name);
          expect(item.product.amount).toEqual(fakePurchaseOrders[i].items[h].product.amount);
          expect(item.quantity).toEqual(fakePurchaseOrders[i].items[h].quantity);
          expect(item.purchase_order_id)
            .toEqual(fakePurchaseOrders[i].items[h].purchaseOrder);
        }
      }

      expect(PurchaseOrderModelMock.find).toHaveBeenCalledTimes(1);
      expect(PurchaseOrderModelMock.find).toHaveBeenCalledWith(
        { customer: customerId },
      );
      expect(populateVoucherMock).toHaveBeenCalledWith({ path: 'voucher', model: VoucherModel });
      expect(populateItemsMock).toHaveBeenCalledWith({
        path: 'items',
        model: PurchaseOrderItemModel,
        populate: {
          path: 'product',
          select: '_id name amount',
          model: ProductModel,
        },
      });
    });

    it('throws a RepositoryError if occur an unexpected error', () => {
      expect.assertions(2);

      const customerId = faker.datatype.uuid();

      PurchaseOrderModelMock.find.mockImplementationOnce(() => {
        throw new Error('test');
      });

      return repository.getPurchaseOrdersByCustomerId(customerId).catch((e: any) => {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('MongoosePurchaseOrderRepository - test');
      });
    });
  });

  describe('MongoosePurchaseOrderRepository.getDraftPurchaseOrderByCustomerId()', () => {
    beforeEach(() => {
      PurchaseOrderModelMock.findOne.mockClear();
    });

    it('returns a draft purchase order by customer id', async () => {
      expect.assertions(13);

      const customerId = faker.datatype.uuid();
      const purchaseOrderId = faker.datatype.uuid();

      const fakeDraftPurchaseOrder = {
        _id: purchaseOrderId,
        customer: customerId,
        code: parseInt(faker.datatype.number().toString(), 10),
        status: PurchaseOrderStatus.DRAFT,
        totalAmount: 0,
        discountAmount: 0,
        createdAt: new Date(),
        voucher: null,
        items: [
          {
            _id: faker.datatype.uuid(),
            quantity: parseInt(faker.datatype.number().toString(), 10),
            purchaseOrder: purchaseOrderId,
            product: {
              _id: faker.datatype.uuid(),
              name: faker.commerce.product(),
              amount: faker.datatype.float(),
            },
          },
        ],
      };

      const populateItemsMock = jest.fn()
        .mockImplementation(() => Promise.resolve(fakeDraftPurchaseOrder));

      PurchaseOrderModelMock.findOne
        .mockImplementationOnce(() => ({ populate: populateItemsMock } as any));

      const purchaseOrder = await repository.getDraftPurchaseOrderByCustomerId(customerId);

      expect(purchaseOrder!.id).toEqual(fakeDraftPurchaseOrder._id);
      expect(purchaseOrder!.customer_id).toEqual(fakeDraftPurchaseOrder.customer);
      expect(purchaseOrder!.code).toEqual(fakeDraftPurchaseOrder.code);
      expect(purchaseOrder!.created_at).toEqual(fakeDraftPurchaseOrder.createdAt);
      expect(purchaseOrder!.discount_amount).toEqual(fakeDraftPurchaseOrder.discountAmount);

      for (let i = 0, poLength = purchaseOrder!.items.length; i < poLength; i += 1) {
        const item = purchaseOrder!.items[i];

        expect(item.id).toEqual(fakeDraftPurchaseOrder.items[i]._id);
        expect(item.product.id).toEqual(fakeDraftPurchaseOrder.items[i].product._id);
        expect(item.product.name).toEqual(fakeDraftPurchaseOrder.items[i].product.name);
        expect(item.product.amount).toEqual(fakeDraftPurchaseOrder.items[i].product.amount);
        expect(item.quantity).toEqual(fakeDraftPurchaseOrder.items[i].quantity);
        expect(item.purchase_order_id)
          .toEqual(fakeDraftPurchaseOrder.items[i].purchaseOrder);
      }

      expect(PurchaseOrderModelMock.findOne).toHaveBeenCalledWith({
        customer: customerId, status: PurchaseOrderStatus.DRAFT,
      });
      expect(populateItemsMock).toHaveBeenCalledWith({
        path: 'items',
        model: PurchaseOrderItemModel,
        populate: {
          path: 'product',
          select: '_id name amount',
          model: ProductModel,
        },
      });
    });

    it('throws a RepositoryError if occur an unexpected error', () => {
      expect.assertions(2);

      const customerId = faker.datatype.uuid();

      PurchaseOrderModelMock.findOne.mockImplementationOnce(() => {
        throw new Error('test');
      });

      return repository.getDraftPurchaseOrderByCustomerId(customerId).catch((e: any) => {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('MongoosePurchaseOrderRepository - test');
      });
    });
  });

  describe('MongoosePurchaseOrderRepository.addPurchaseOrder()', () => {
    beforeEach(() => {
      PurchaseOrderItemModelMock.find.mockClear();
      PurchaseOrderModelMock.populate.mockClear();
      PurchaseOrderModelMock.create.mockClear();
    });

    it('creates a new purchase order', async () => {
      expect.assertions(1);

      const customerId = faker.datatype.uuid();
      const purchaseOrderId = faker.datatype.uuid();

      const fakePurchaseOrder = {
        _id: purchaseOrderId,
        customer: customerId,
        code: parseInt(faker.datatype.number().toString(), 10),
        status: PurchaseOrderStatus.DRAFT,
        totalAmount: 0,
        discountAmount: 0,
        createdAt: new Date(),
        voucher: {
          _id: faker.datatype.uuid(),
          percentageAmount: 0,
          rawDiscountAmount: 0,
          quantity: parseInt(faker.datatype.number().toString(), 10),
          type: VoucherDiscountTypes.ABSOLUTE,
          active: faker.datatype.boolean(),
          code: parseInt(faker.datatype.number().toString(), 10),
          expiresAt: new Date(),
          createdAt: new Date(),
        },
        items: [
          {
            _id: faker.datatype.uuid(),
            quantity: parseInt(faker.datatype.number().toString(), 10),
            purchaseOrder: purchaseOrderId,
            product: {
              _id: faker.datatype.uuid(),
              name: faker.commerce.product(),
              amount: faker.datatype.float(),
            },
          },
        ],
      };

      PurchaseOrderModelMock.create
        .mockImplementationOnce(() => Promise.resolve(fakePurchaseOrder as any));

      const purchaseOrder = new PurchaseOrder({
        id: fakePurchaseOrder._id,
        customer_id: fakePurchaseOrder.customer,
        code: fakePurchaseOrder.code,
        status: fakePurchaseOrder.status,
        voucher: {
          id: fakePurchaseOrder.voucher._id,
          active: fakePurchaseOrder.voucher.active,
          code: fakePurchaseOrder.voucher.code,
          percentage_amount: fakePurchaseOrder.voucher.percentageAmount,
          raw_discount_amount: fakePurchaseOrder.voucher.rawDiscountAmount,
          quantity: fakePurchaseOrder.voucher.quantity,
          type: fakePurchaseOrder.voucher.type,
          created_at: fakePurchaseOrder.voucher.createdAt,
          expires_at: fakePurchaseOrder.voucher.expiresAt,
          usedAt: null,
        },
        created_at: fakePurchaseOrder.createdAt,
        items: [],
      });

      purchaseOrder.addItem(new PurchaseOrderItem({
        id: fakePurchaseOrder.items[0]._id,
        quantity: fakePurchaseOrder.items[0].quantity,
        product: {
          id: fakePurchaseOrder.items[0].product._id,
          name: fakePurchaseOrder.items[0].product.name,
          amount: fakePurchaseOrder.items[0].product.amount,
        },
      }));

      await repository.addPurchaseOrder(purchaseOrder);

      expect(PurchaseOrderModelMock.create).toHaveBeenCalledWith({
        _id: purchaseOrder.id,
        customer: purchaseOrder.customer_id,
        code: purchaseOrder.code,
        status: purchaseOrder.status,
        totalAmount: purchaseOrder.total_amount,
        discountAmount: purchaseOrder.discount_amount,
        createdAt: purchaseOrder.created_at,
        voucher: purchaseOrder.voucher!.id,
        items: [purchaseOrder.items[0].id],
      });
    });

    it('creates a new purchase order without voucher', async () => {
      expect.assertions(1);

      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        customer_id: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        status: PurchaseOrderStatus.STARTED,
        total_amount: 0,
        discount_amount: 0,
        created_at: new Date(),
        voucher: null,
        items: [],
      });

      purchaseOrder.addItem(new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number().toString(), 10),
        purchase_order_id: purchaseOrder.id,
        product: {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          amount: faker.datatype.float(),
        },
      }));

      await repository.addPurchaseOrder(purchaseOrder);

      expect(PurchaseOrderModelMock.create).toHaveBeenCalledWith({
        _id: purchaseOrder.id,
        customer: purchaseOrder.customer_id,
        code: purchaseOrder.code,
        status: purchaseOrder.status,
        totalAmount: purchaseOrder.total_amount,
        discountAmount: purchaseOrder.discount_amount,
        createdAt: purchaseOrder.created_at,
        voucher: undefined,
        items: [purchaseOrder.items[0].id],
      });
    });

    it('throws a RepositoryError if occur an unexpected error', () => {
      expect.assertions(2);

      PurchaseOrderModelMock.create.mockRejectedValueOnce(new Error('test') as never);

      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        customer_id: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        status: PurchaseOrderStatus.STARTED,
        total_amount: 0,
        discount_amount: 0,
        created_at: new Date(),
        voucher: null,
        items: [],
      });

      return repository.addPurchaseOrder(purchaseOrder).catch((e: any) => {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('MongoosePurchaseOrderRepository - test');
      });
    });
  });

  describe('MongoosePurchaseOrderRepository.updatePurchaseOrder()', () => {
    afterAll(() => {
      PurchaseOrderModelMock.findOne.mockClear();
      PurchaseOrderModelMock.populate.mockClear();
    });

    it('updates a specific purchase order', async () => {
      expect.assertions(2);

      const saveMock = jest.fn();

      PurchaseOrderModelMock.findOne
        .mockResolvedValueOnce({ save: saveMock });

      const purchaseOrder = new PurchaseOrder({
        id: faker.datatype.uuid(),
        customer_id: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        status: PurchaseOrderStatus.STARTED,
        total_amount: 0,
        discount_amount: 0,
        created_at: new Date(),
        voucher: {
          id: faker.datatype.uuid(),
          percentage_amount: 0,
          raw_discount_amount: 0,
          quantity: parseInt(faker.datatype.number().toString(), 10),
          type: VoucherDiscountTypes.ABSOLUTE,
          active: faker.datatype.boolean(),
          code: parseInt(faker.datatype.number().toString(), 10),
          expires_at: new Date(),
          created_at: new Date(),
          usedAt: null,
        },
        items: [],
      });

      purchaseOrder.addItem(new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number().toString(), 10),
        purchase_order_id: purchaseOrder.id,
        product: {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          amount: faker.datatype.float(),
        },
      }));

      await repository.updatePurchaseOrder(purchaseOrder);

      expect(PurchaseOrderModelMock.findOne).toHaveBeenCalledWith({ _id: purchaseOrder.id });
      expect(saveMock).toHaveBeenCalledTimes(1);
    });

    it('throws a RepositoryError if occur an unexpected error', async () => {
      expect.assertions(2);

      const customerId = faker.datatype.uuid();
      const purchaseOrderId = faker.datatype.uuid();

      const fakePurchaseOrder = {
        _id: purchaseOrderId,
        customer: customerId,
        code: parseInt(faker.datatype.number().toString(), 10),
        status: PurchaseOrderStatus.STARTED,
        totalAmount: 0,
        discountAmount: 0,
        createdAt: new Date(),
        voucher: {
          _id: faker.datatype.uuid(),
          percentageAmount: 0,
          rawDiscountAmount: 0,
          quantity: parseInt(faker.datatype.number().toString(), 10),
          type: VoucherDiscountTypes.ABSOLUTE,
          active: faker.datatype.boolean(),
          code: parseInt(faker.datatype.number().toString(), 10),
          expiresAt: new Date(),
          createdAt: new Date(),
        },
      };

      PurchaseOrderModelMock.findOne.mockImplementationOnce(() => {
        throw new Error('test');
      });

      const purchaseOrder = new PurchaseOrder({
        id: fakePurchaseOrder._id,
        customer_id: fakePurchaseOrder.customer,
        code: fakePurchaseOrder.code,
        status: fakePurchaseOrder.status,
        voucher: {
          id: fakePurchaseOrder.voucher._id,
          active: fakePurchaseOrder.voucher.active,
          code: fakePurchaseOrder.voucher.code,
          percentage_amount: fakePurchaseOrder.voucher.percentageAmount,
          raw_discount_amount: fakePurchaseOrder.voucher.rawDiscountAmount,
          quantity: fakePurchaseOrder.voucher.quantity,
          type: fakePurchaseOrder.voucher.type,
          created_at: fakePurchaseOrder.voucher.createdAt,
          expires_at: fakePurchaseOrder.voucher.expiresAt,
          usedAt: null,
        },
        created_at: fakePurchaseOrder.createdAt,
        items: [],
      });

      return repository.updatePurchaseOrder(purchaseOrder).catch((e: any) => {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('MongoosePurchaseOrderRepository - test');
      });
    });
  });

  describe('MongoosePurchaseOrderRepository.getPurchaseOrderItemById()', () => {
    beforeEach(() => {
      PurchaseOrderItemModelMock.findOne.mockClear();
    });

    it('returns a purchase order item by id', async () => {
      expect.assertions(4);

      const fakePurchaseOrderItem = {
        _id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number().toString(), 10),
        purchaseOrderId: faker.datatype.uuid(),
        product: {
          _id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          amount: faker.datatype.float(),
        },
      };

      PurchaseOrderItemModelMock.findOne.mockResolvedValueOnce(fakePurchaseOrderItem as any);

      const purchaseOrderItem = await repository
        .getPurchaseOrderItemById(fakePurchaseOrderItem._id);

      expect(purchaseOrderItem!.id).toEqual(fakePurchaseOrderItem._id);
      expect(purchaseOrderItem!.quantity).toEqual(fakePurchaseOrderItem.quantity);
      expect(purchaseOrderItem!.product).toEqual(new Product({
        id: fakePurchaseOrderItem.product._id,
        name: fakePurchaseOrderItem.product.name,
        amount: fakePurchaseOrderItem.product.amount,
      }));

      expect(PurchaseOrderItemModelMock.findOne).toHaveBeenCalledWith(
        { _id: fakePurchaseOrderItem._id },
        undefined,
        {
          populate: {
            path: 'product',
            select: '_id name amount',
            model: ProductModel,
          },
        },
      );
    });

    it("returns null if purchase order item doesn't exist", async () => {
      expect.assertions(2);

      const fakePurchaseOrderItemId = faker.datatype.uuid();

      PurchaseOrderItemModelMock.findOne.mockResolvedValueOnce(null);

      const purchaseOrderItem = await repository.getPurchaseOrderItemById(fakePurchaseOrderItemId);

      expect(purchaseOrderItem).toBeNull();
      expect(PurchaseOrderItemModelMock.findOne).toHaveBeenCalledWith(
        { _id: fakePurchaseOrderItemId },
        undefined,
        {
          populate: {
            path: 'product',
            select: '_id name amount',
            model: ProductModel,
          },
        },
      );
    });

    it('throws a RepositoryError if occur an unexpected error', async () => {
      expect.assertions(2);

      const fakePurchaseOrderItem = {
        _id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number().toString(), 10),
        purchaseOrderId: faker.datatype.uuid(),
        product: {
          _id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          amount: faker.datatype.float(),
        },
      };

      PurchaseOrderItemModelMock.findOne.mockImplementationOnce(() => {
        throw new Error('test');
      });

      return repository.getPurchaseOrderItemById(fakePurchaseOrderItem._id).catch((e: any) => {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('MongoosePurchaseOrderRepository - test');
      });
    });
  });

  describe('MongoosePurchaseOrderRepository.getPurchaseOrderItem()', () => {
    beforeEach(() => {
      PurchaseOrderItemModelMock.findOne.mockClear();
    });

    it('gets a purchase order item by purchase order id and product id', async () => {
      expect.assertions(5);

      const fakePurchaseOrderId = faker.datatype.uuid();

      const fakePurchaseOrderItem = {
        _id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number().toString(), 10),
        purchaseOrder: fakePurchaseOrderId,
        product: {
          _id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          amount: faker.datatype.float(),
        },
      };

      PurchaseOrderItemModelMock.findOne.mockResolvedValueOnce(fakePurchaseOrderItem as any);

      const purchaseOrderItem = await repository.getPurchaseOrderItem({
        purchase_order_id: fakePurchaseOrderId,
        product_id: fakePurchaseOrderItem.product._id,
      });

      expect(purchaseOrderItem!.id).toEqual(fakePurchaseOrderItem._id);
      expect(purchaseOrderItem!.quantity).toEqual(fakePurchaseOrderItem.quantity);
      expect(purchaseOrderItem!.purchase_order_id).toEqual(fakePurchaseOrderItem.purchaseOrder);
      expect(purchaseOrderItem!.product).toEqual(new Product({
        id: fakePurchaseOrderItem.product._id,
        name: fakePurchaseOrderItem.product.name,
        amount: fakePurchaseOrderItem.product.amount,
      }));

      expect(PurchaseOrderItemModelMock.findOne).toHaveBeenCalledWith(
        {
          product: fakePurchaseOrderItem.product._id,
          purchaseOrder: fakePurchaseOrderItem.purchaseOrder,
        },
        undefined,
        {
          populate: {
            path: 'product',
            select: '_id name amount',
            model: ProductModel,
          },
        },
      );
    });

    it('throws a RepositoryError if occur an unexpected error', () => {
      expect.assertions(2);

      PurchaseOrderItemModelMock.findOne.mockImplementationOnce(() => {
        throw new Error('test');
      });

      return repository.getPurchaseOrderItem({
        purchase_order_id: faker.datatype.uuid(),
        product_id: faker.datatype.uuid(),
      }).catch((e: any) => {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('MongoosePurchaseOrderRepository - test');
      });
    });
  });

  describe('MongoosePurchaseOrderRepository.addPurchaseOrderItem()', () => {
    beforeEach(() => {
      PurchaseOrderItemModelMock.create.mockClear();
    });

    it('creates a new purchase order item', async () => {
      expect.assertions(1);

      const purchaseOrderItem = new PurchaseOrderItem({
        id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number().toString(), 10),
        purchase_order_id: faker.datatype.uuid(),
        product: {
          id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          amount: faker.datatype.float(),
        },
      });

      await repository.addPurchaseOrderItem(purchaseOrderItem);

      expect(PurchaseOrderItemModelMock.create).toHaveBeenCalledWith({
        _id: purchaseOrderItem.id,
        purchaseOrder: purchaseOrderItem.purchase_order_id,
        quantity: purchaseOrderItem.quantity,
        product: purchaseOrderItem.product.id,
      });
    });

    it('throws a RepositoryError if occur an unexpected error', () => {
      expect.assertions(2);

      PurchaseOrderItemModelMock.create.mockRejectedValueOnce(new Error('test') as never);

      return repository.addPurchaseOrderItem(
        new PurchaseOrderItem({
          id: faker.datatype.uuid(),
          purchase_order_id: faker.datatype.uuid(),
          quantity: parseInt(faker.datatype.number().toString(), 10),
          product: {
            id: faker.datatype.uuid(),
            name: faker.commerce.product(),
            amount: faker.datatype.float(),
          },
        }),
      ).catch((e: any) => {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('MongoosePurchaseOrderRepository - test');
      });
    });
  });

  describe('MongoosePurchaseOrderRepository.updatePurchaseOrderItem()', () => {
    beforeEach(() => {
      PurchaseOrderItemModelMock.findOneAndUpdate.mockClear();
    });

    it('updates a specific purchase order item', async () => {
      expect.assertions(1);

      const fakePurchaseOrderItem = {
        _id: faker.datatype.uuid(),
        quantity: parseInt(faker.datatype.number().toString(), 10),
        purchaseOrder: faker.datatype.uuid(),
        product: {
          _id: faker.datatype.uuid(),
          name: faker.commerce.product(),
          amount: faker.datatype.float(),
        },
      };

      PurchaseOrderItemModelMock.findOneAndUpdate
        .mockResolvedValueOnce(fakePurchaseOrderItem as any);

      await repository.updatePurchaseOrderItem(
        new PurchaseOrderItem({
          id: fakePurchaseOrderItem._id,
          purchase_order_id: fakePurchaseOrderItem.purchaseOrder,
          quantity: fakePurchaseOrderItem.quantity,
          product: {
            id: fakePurchaseOrderItem.product._id,
            name: fakePurchaseOrderItem.product.name,
            amount: fakePurchaseOrderItem.product.amount,
          },
        }),
      );

      expect(PurchaseOrderItemModelMock.findOneAndUpdate).toHaveBeenCalledWith(
        { id: fakePurchaseOrderItem._id },
        { $set: { quantity: fakePurchaseOrderItem.quantity } },
        {
          new: true,
          populate: {
            path: 'product',
            select: '_id name amount',
            model: ProductModel,
          },
        },
      );
    });

    it('throws a RepositoryError if occur an unexpected error', () => {
      expect.assertions(2);

      PurchaseOrderItemModelMock.findOneAndUpdate.mockImplementationOnce(() => {
        throw new Error('test');
      });

      return repository.updatePurchaseOrderItem(
        new PurchaseOrderItem({
          id: faker.datatype.uuid(),
          quantity: parseInt(faker.datatype.number().toString(), 10),
          purchase_order_id: faker.datatype.uuid(),
          product: {
            id: faker.datatype.uuid(),
            name: faker.commerce.product(),
            amount: faker.datatype.float(),
          },
        }),
      ).catch((e: any) => {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('MongoosePurchaseOrderRepository - test');
      });
    });
  });

  describe('MongoosePurchaseOrderRepository.deletePurchaseOrderItem()', () => {
    beforeEach(() => {
      PurchaseOrderItemModelMock.deleteOne.mockClear();
    });

    it('deletes a purchas order item by id', async () => {
      expect.assertions(1);

      const fakePurchaseOrderItemId = faker.datatype.uuid();

      PurchaseOrderItemModelMock.deleteOne.mockResolvedValueOnce({ deletedCount: 1 } as any);

      await repository.deletePurchaseOrderItem(fakePurchaseOrderItemId);

      expect(PurchaseOrderItemModelMock.deleteOne).toHaveBeenCalledWith({
        _id: fakePurchaseOrderItemId,
      });
    });

    it("throws a RepositoryError if the purchase order wasn't deleted", () => {
      expect.assertions(2);

      const fakePurchaseOrderItemId = faker.datatype.uuid();

      PurchaseOrderItemModelMock.deleteOne.mockResolvedValueOnce({
        deletedCount: 0,
      } as any);

      return repository.deletePurchaseOrderItem(fakePurchaseOrderItemId).catch((e: any) => {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('MongoosePurchaseOrderRepository - Item não excluído');
      });
    });

    it('throws a RepositoryError if occur an unexpected error', () => {
      expect.assertions(2);

      const fakePurchaseOrderItemId = faker.datatype.uuid();

      PurchaseOrderItemModelMock.deleteOne.mockImplementationOnce(() => {
        throw new Error('test');
      });

      return repository.deletePurchaseOrderItem(fakePurchaseOrderItemId).catch((e: any) => {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('MongoosePurchaseOrderRepository - test');
      });
    });
  });

  describe('MongoosePurchaseOrderRepository.getVoucherByCode()', () => {
    beforeEach(() => {
      VoucherModelMock.findOne.mockClear();
    });

    it('gets a voucher by code', async () => {
      expect.assertions(10);

      const fakeVoucher = {
        _id: faker.datatype.uuid(),
        code: parseInt(faker.datatype.number().toString(), 10),
        percentageAmount: faker.datatype.float(),
        rawDiscountAmount: faker.datatype.float(),
        quantity: parseInt(faker.datatype.number().toString(), 10),
        type: VoucherDiscountTypes.ABSOLUTE,
        createdAt: new Date(),
        expiresAt: new Date(),
        active: faker.datatype.boolean(),
        usedAt: null,
      };

      VoucherModelMock.findOne.mockResolvedValueOnce(fakeVoucher as any);

      const voucher = await repository.getVoucherByCode(fakeVoucher.code);

      expect(voucher!.id).toEqual(fakeVoucher._id);
      expect(voucher!.code).toEqual(fakeVoucher.code);
      expect(voucher!.percentage_amount).toEqual(fakeVoucher.percentageAmount);
      expect(voucher!.raw_discount_amount).toEqual(fakeVoucher.rawDiscountAmount);
      expect(voucher!.quantity).toEqual(fakeVoucher.quantity);
      expect(voucher!.type).toEqual(fakeVoucher.type);
      expect(voucher!.created_at).toEqual(fakeVoucher.createdAt);
      expect(voucher!.expires_at).toEqual(fakeVoucher.expiresAt);
      expect(voucher!.usedAt).toBeNull();

      expect(VoucherModelMock.findOne).toHaveBeenCalledWith({ code: fakeVoucher.code });
    });

    it("returns null if voucher doesn't exist", async () => {
      expect.assertions(2);

      const fakeVoucherCode = parseInt(faker.datatype.number().toString(), 10);

      VoucherModelMock.findOne.mockResolvedValueOnce(null);

      const voucher = await repository.getVoucherByCode(fakeVoucherCode);

      expect(voucher).toBeNull();
      expect(VoucherModelMock.findOne).toHaveBeenCalledWith({ code: fakeVoucherCode });
    });

    it('throws a RepositoryError if occur an unexpected error', () => {
      expect.assertions(2);

      const fakeVoucherCode = parseInt(faker.datatype.number().toString(), 10);

      VoucherModelMock.findOne.mockImplementationOnce(() => {
        throw new Error('test');
      });

      return repository.getVoucherByCode(fakeVoucherCode).catch((e: any) => {
        expect(e).toBeInstanceOf(RepositoryError);
        expect(e.message).toEqual('MongoosePurchaseOrderRepository - test');
      });
    });
  });
});
