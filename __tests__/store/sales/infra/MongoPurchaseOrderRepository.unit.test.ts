import { faker } from '@faker-js/faker';
import PurchaseOrder, { PurchaseOrderStatus } from '@sales/domain/PurchaseOrder';
import Voucher, { VoucherDiscountTypes } from '@sales/domain/Voucher';
import MongoPurchaseOrderRepository from '@sales/infra/persistence/MongoPurchaseOrderRepository';
import PurchaseOrderModel from '@mongo/models/PurchaseOrderModel';
import PurchaseOrderItemModel from '@mongo/models/PurchaseOrderItemModel';
import VoucherModel from '@mongo/models/VoucherModel';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import Product from '@sales/domain/Product';
import { ProductModel } from '@mongo/models';

jest.mock('../../../../mongo/models/PurchaseOrderModel');
jest.mock('../../../../mongo/models/PurchaseOrderItemModel');
jest.mock('../../../../mongo/models/VoucherModel');
jest.mock('../../../../mongo/models/ProductModel');
jest.mock('../../../../mongo/models/UserModel');

const PurchaseOrderModelMock = jest.mocked(PurchaseOrderModel);
const PurchaseOrderItemModelMock = jest.mocked(PurchaseOrderItemModel);
const VoucherModelMock = jest.mocked(VoucherModel);

describe("MongoPurchaseOrderRepository's unit tests", () => {
  describe('MongoPurchaseOrderRepository.getPurchaseOrderById()', () => {
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

      const repository = new MongoPurchaseOrderRepository();

      const purchaseOrder = await repository.getPurchaseOrderById(purchaseOrderId);

      expect(purchaseOrder!.id).toEqual(fakePurchaseOrder._id);
      expect(purchaseOrder!.customerId).toEqual(fakePurchaseOrder.customer);
      expect(purchaseOrder!.code).toEqual(fakePurchaseOrder.code);
      expect(purchaseOrder!.createdAt).toEqual(fakePurchaseOrder.createdAt);
      expect(purchaseOrder!.discountAmount).toEqual(fakePurchaseOrder.discountAmount);
      expect(purchaseOrder!.voucher!.id).toEqual(fakePurchaseOrder.voucher._id);
      expect(purchaseOrder!.voucher!.active).toEqual(fakePurchaseOrder.voucher.active);
      expect(purchaseOrder!.voucher!.code).toEqual(fakePurchaseOrder.voucher.code);
      expect(purchaseOrder!.voucher!.type).toEqual(fakePurchaseOrder.voucher.type);
      expect(purchaseOrder!.voucher!.percentageAmount)
        .toEqual(fakePurchaseOrder.voucher.percentageAmount);
      expect(purchaseOrder!.voucher!.rawDiscountAmount)
        .toEqual(fakePurchaseOrder.voucher.rawDiscountAmount);
      expect(purchaseOrder!.voucher!.createdAt).toEqual(fakePurchaseOrder.voucher.createdAt);
      expect(purchaseOrder!.voucher!.expiresAt).toEqual(fakePurchaseOrder.voucher.expiresAt);
      expect(purchaseOrder!.voucher!.usedAt).toEqual(null);

      purchaseOrder!.items.forEach((item, index) => {
        expect(item.id).toEqual(fakePurchaseOrder.items[index]._id);
        expect(item.product.id).toEqual(fakePurchaseOrder.items[index].product._id);
        expect(item.product.name).toEqual(fakePurchaseOrder.items[index].product.name);
        expect(item.product.amount).toEqual(fakePurchaseOrder.items[index].product.amount);
        expect(item.quantity).toEqual(fakePurchaseOrder.items[index].quantity);
        expect(item.purchaseOrderId).toEqual(fakePurchaseOrder.items[index].purchaseOrder);
      });

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
  });

  describe('MongoPurchaseOrderRepository.getPurchaseOrdersByCustomerId()', () => {
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

      const repository = new MongoPurchaseOrderRepository();

      const purchaseOrders = await repository.getPurchaseOrdersByCustomerId(customerId);

      purchaseOrders.forEach((purchaseOrder, index) => {
        expect(purchaseOrder!.id).toEqual(fakePurchaseOrders[index]._id);
        expect(purchaseOrder!.customerId).toEqual(fakePurchaseOrders[index].customer);
        expect(purchaseOrder!.code).toEqual(fakePurchaseOrders[index].code);
        expect(purchaseOrder!.createdAt).toEqual(fakePurchaseOrders[index].createdAt);
        expect(purchaseOrder!.discountAmount).toEqual(fakePurchaseOrders[index].discountAmount);
        expect(purchaseOrder!.voucher!.id).toEqual(fakePurchaseOrders[index].voucher._id);
        expect(purchaseOrder!.voucher!.active).toEqual(fakePurchaseOrders[index].voucher.active);
        expect(purchaseOrder!.voucher!.code).toEqual(fakePurchaseOrders[index].voucher.code);
        expect(purchaseOrder!.voucher!.type).toEqual(fakePurchaseOrders[index].voucher.type);
        expect(purchaseOrder!.voucher!.percentageAmount)
          .toEqual(fakePurchaseOrders[index].voucher.percentageAmount);
        expect(purchaseOrder!.voucher!.rawDiscountAmount)
          .toEqual(fakePurchaseOrders[index].voucher.rawDiscountAmount);
        expect(purchaseOrder!.voucher!.createdAt)
          .toEqual(fakePurchaseOrders[index].voucher.createdAt);
        expect(purchaseOrder!.voucher!.expiresAt)
          .toEqual(fakePurchaseOrders[index].voucher.expiresAt);
        expect(purchaseOrder!.voucher!.usedAt).toEqual(null);

        purchaseOrder!.items.forEach((item, idx) => {
          expect(item.id).toEqual(fakePurchaseOrders[index].items[idx]._id);
          expect(item.product.id).toEqual(fakePurchaseOrders[index].items[idx].product._id);
          expect(item.product.name).toEqual(fakePurchaseOrders[index].items[idx].product.name);
          expect(item.product.amount).toEqual(fakePurchaseOrders[index].items[idx].product.amount);
          expect(item.quantity).toEqual(fakePurchaseOrders[index].items[idx].quantity);
          expect(item.purchaseOrderId)
            .toEqual(fakePurchaseOrders[index].items[idx].purchaseOrder);
        });
      });

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
  });

  describe('MongoPurchaseOrderRepository.getDraftPurchaseOrderByCustomerId()', () => {
    it('returns a draft purchase order by customer id', async () => {
      expect.assertions(13);

      PurchaseOrderModelMock.findOne.mockClear();

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

      const repository = new MongoPurchaseOrderRepository();

      const purchaseOrder = await repository.getDraftPurchaseOrderByCustomerId(customerId);

      expect(purchaseOrder!.id).toEqual(fakeDraftPurchaseOrder._id);
      expect(purchaseOrder!.customerId).toEqual(fakeDraftPurchaseOrder.customer);
      expect(purchaseOrder!.code).toEqual(fakeDraftPurchaseOrder.code);
      expect(purchaseOrder!.createdAt).toEqual(fakeDraftPurchaseOrder.createdAt);
      expect(purchaseOrder!.discountAmount).toEqual(fakeDraftPurchaseOrder.discountAmount);

      purchaseOrder!.items.forEach((item, idx) => {
        expect(item.id).toEqual(fakeDraftPurchaseOrder.items[idx]._id);
        expect(item.product.id).toEqual(fakeDraftPurchaseOrder.items[idx].product._id);
        expect(item.product.name).toEqual(fakeDraftPurchaseOrder.items[idx].product.name);
        expect(item.product.amount).toEqual(fakeDraftPurchaseOrder.items[idx].product.amount);
        expect(item.quantity).toEqual(fakeDraftPurchaseOrder.items[idx].quantity);
        expect(item.purchaseOrderId)
          .toEqual(fakeDraftPurchaseOrder.items[idx].purchaseOrder);
      });

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
  });

  describe('MongoPurchaseOrderRepository.addPurchaseOrder()', () => {
    it('creates a new purchase order', async () => {
      expect.assertions(23);

      PurchaseOrderItemModelMock.find.mockClear();

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

      PurchaseOrderModelMock.populate
        .mockImplementationOnce(() => Promise.resolve(fakePurchaseOrder as any));

      const purchaseOrder = new PurchaseOrder({
        id: fakePurchaseOrder._id,
        customerId: fakePurchaseOrder.customer,
        code: fakePurchaseOrder.code,
        status: fakePurchaseOrder.status,
        voucher: new Voucher({
          id: fakePurchaseOrder.voucher._id,
          active: fakePurchaseOrder.voucher.active,
          code: fakePurchaseOrder.voucher.code,
          percentageAmount: fakePurchaseOrder.voucher.percentageAmount,
          rawDiscountAmount: fakePurchaseOrder.voucher.rawDiscountAmount,
          quantity: fakePurchaseOrder.voucher.quantity,
          type: fakePurchaseOrder.voucher.type,
          createdAt: fakePurchaseOrder.voucher.createdAt,
          expiresAt: fakePurchaseOrder.voucher.expiresAt,
          usedAt: null,
        }),
        createdAt: fakePurchaseOrder.createdAt,
      });

      purchaseOrder.addItem(new PurchaseOrderItem({
        id: fakePurchaseOrder.items[0]._id,
        quantity: fakePurchaseOrder.items[0].quantity,
        product: new Product(
          fakePurchaseOrder.items[0].product._id,
          fakePurchaseOrder.items[0].product.name,
          fakePurchaseOrder.items[0].product.amount,
        ),
      }));

      const repository = new MongoPurchaseOrderRepository();

      const result = await repository.addPurchaseOrder(purchaseOrder);

      expect(result.id).toEqual(purchaseOrder.id);
      expect(result.customerId).toEqual(purchaseOrder.customerId);
      expect(result.code).toEqual(purchaseOrder.code);
      expect(result.createdAt).toEqual(purchaseOrder.createdAt);
      expect(result.discountAmount).toEqual(purchaseOrder.discountAmount);
      expect(result.voucher!.id).toEqual(purchaseOrder.voucher!.id);
      expect(result.voucher!.active).toEqual(purchaseOrder.voucher!.active);
      expect(result.voucher!.code).toEqual(purchaseOrder.voucher!.code);
      expect(result.voucher!.percentageAmount).toEqual(purchaseOrder.voucher!.percentageAmount);
      expect(result.voucher!.rawDiscountAmount).toEqual(purchaseOrder.voucher!.rawDiscountAmount);
      expect(result.voucher!.quantity).toEqual(purchaseOrder.voucher!.quantity);
      expect(result.voucher!.type).toEqual(purchaseOrder.voucher!.type);
      expect(result.voucher!.createdAt).toEqual(purchaseOrder.voucher!.createdAt);
      expect(result.voucher!.expiresAt).toEqual(purchaseOrder.voucher!.expiresAt);
      expect(result.voucher!.usedAt).toEqual(null);

      purchaseOrder!.items.forEach((item, idx) => {
        expect(item.id).toEqual(fakePurchaseOrder.items[idx]._id);
        expect(item.product.id).toEqual(fakePurchaseOrder.items[idx].product._id);
        expect(item.product.name).toEqual(fakePurchaseOrder.items[idx].product.name);
        expect(item.product.amount).toEqual(fakePurchaseOrder.items[idx].product.amount);
        expect(item.quantity).toEqual(fakePurchaseOrder.items[idx].quantity);
        expect(item.purchaseOrderId)
          .toEqual(fakePurchaseOrder.items[idx].purchaseOrder);
      });
      expect(PurchaseOrderModelMock.populate).toHaveBeenCalledWith(
        fakePurchaseOrder,
        { path: 'voucher', model: VoucherModel },
      );
      expect(PurchaseOrderModelMock.create).toHaveBeenCalledWith({
        _id: purchaseOrder.id,
        customer: purchaseOrder.customerId,
        code: purchaseOrder.code,
        status: purchaseOrder.status,
        totalAmount: purchaseOrder.totalAmount,
        discountAmount: purchaseOrder.discountAmount,
        createdAt: purchaseOrder.createdAt,
        voucher: purchaseOrder.voucher!.id,
        items: [purchaseOrder.items[0].id],
      });
    });

    it('creates a new purchase order without voucher', async () => {
      expect.assertions(14);

      PurchaseOrderModelMock.populate.mockClear();
      PurchaseOrderModelMock.create.mockClear();

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

      PurchaseOrderModelMock.create
        .mockImplementationOnce(() => Promise.resolve(fakePurchaseOrder as any));

      PurchaseOrderModelMock.populate
        .mockImplementationOnce(() => Promise.resolve(fakePurchaseOrder as any));

      const purchaseOrder = new PurchaseOrder({
        id: fakePurchaseOrder._id,
        customerId: fakePurchaseOrder.customer,
        code: fakePurchaseOrder.code,
        status: fakePurchaseOrder.status,
        voucher: null,
        createdAt: fakePurchaseOrder.createdAt,
      });

      purchaseOrder.addItem(new PurchaseOrderItem({
        id: fakePurchaseOrder.items[0]._id,
        quantity: fakePurchaseOrder.items[0].quantity,
        product: new Product(
          fakePurchaseOrder.items[0].product._id,
          fakePurchaseOrder.items[0].product.name,
          fakePurchaseOrder.items[0].product.amount,
        ),
      }));

      const repository = new MongoPurchaseOrderRepository();

      const result = await repository.addPurchaseOrder(purchaseOrder);

      expect(result.id).toEqual(purchaseOrder.id);
      expect(result.customerId).toEqual(purchaseOrder.customerId);
      expect(result.code).toEqual(purchaseOrder.code);
      expect(result.createdAt).toEqual(purchaseOrder.createdAt);
      expect(result.discountAmount).toEqual(purchaseOrder.discountAmount);
      expect(result.voucher).toBeNull();

      purchaseOrder!.items.forEach((item, idx) => {
        expect(item.id).toEqual(fakePurchaseOrder.items[idx]._id);
        expect(item.product.id).toEqual(fakePurchaseOrder.items[idx].product._id);
        expect(item.product.name).toEqual(fakePurchaseOrder.items[idx].product.name);
        expect(item.product.amount).toEqual(fakePurchaseOrder.items[idx].product.amount);
        expect(item.quantity).toEqual(fakePurchaseOrder.items[idx].quantity);
        expect(item.purchaseOrderId)
          .toEqual(fakePurchaseOrder.items[idx].purchaseOrder);
      });

      expect(PurchaseOrderModelMock.populate).toHaveBeenCalledWith(
        fakePurchaseOrder,
        { path: 'voucher', model: VoucherModel },
      );
      expect(PurchaseOrderModelMock.create).toHaveBeenCalledWith({
        _id: purchaseOrder.id,
        customer: purchaseOrder.customerId,
        code: purchaseOrder.code,
        status: purchaseOrder.status,
        totalAmount: purchaseOrder.totalAmount,
        discountAmount: purchaseOrder.discountAmount,
        createdAt: purchaseOrder.createdAt,
        voucher: undefined,
        items: [purchaseOrder.items[0].id],
      });
    });
  });

  describe('MongoPurchaseOrderRepository.updatePurchaseOrder()', () => {
    it('updates a specific purchase order', async () => {
      expect.assertions(24);

      PurchaseOrderModelMock.findOne.mockClear();
      PurchaseOrderModelMock.populate.mockClear();

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

      const saveMock = jest.fn();

      PurchaseOrderModelMock.findOne
        .mockResolvedValueOnce({ save: saveMock });

      PurchaseOrderModelMock.populate
        .mockResolvedValueOnce(fakePurchaseOrder as any);

      const purchaseOrder = new PurchaseOrder({
        id: fakePurchaseOrder._id,
        customerId: fakePurchaseOrder.customer,
        code: fakePurchaseOrder.code,
        status: fakePurchaseOrder.status,
        voucher: new Voucher({
          id: fakePurchaseOrder.voucher._id,
          active: fakePurchaseOrder.voucher.active,
          code: fakePurchaseOrder.voucher.code,
          percentageAmount: fakePurchaseOrder.voucher.percentageAmount,
          rawDiscountAmount: fakePurchaseOrder.voucher.rawDiscountAmount,
          quantity: fakePurchaseOrder.voucher.quantity,
          type: fakePurchaseOrder.voucher.type,
          createdAt: fakePurchaseOrder.voucher.createdAt,
          expiresAt: fakePurchaseOrder.voucher.expiresAt,
          usedAt: null,
        }),
        createdAt: fakePurchaseOrder.createdAt,
      });

      purchaseOrder.addItem(new PurchaseOrderItem({
        id: fakePurchaseOrder.items[0]._id,
        quantity: fakePurchaseOrder.items[0].quantity,
        product: new Product(
          fakePurchaseOrder.items[0].product._id,
          fakePurchaseOrder.items[0].product.name,
          fakePurchaseOrder.items[0].product.amount,
        ),
      }));

      const repository = new MongoPurchaseOrderRepository();

      const result = await repository.updatePurchaseOrder(purchaseOrder);

      expect(result.id).toEqual(purchaseOrder.id);
      expect(result.customerId).toEqual(purchaseOrder.customerId);
      expect(result.code).toEqual(purchaseOrder.code);
      expect(result.createdAt).toEqual(purchaseOrder.createdAt);
      expect(result.discountAmount).toEqual(purchaseOrder.discountAmount);
      expect(result.voucher!.id).toEqual(purchaseOrder.voucher!.id);
      expect(result.voucher!.active).toEqual(purchaseOrder.voucher!.active);
      expect(result.voucher!.code).toEqual(purchaseOrder.voucher!.code);
      expect(result.voucher!.percentageAmount).toEqual(purchaseOrder.voucher!.percentageAmount);
      expect(result.voucher!.rawDiscountAmount).toEqual(purchaseOrder.voucher!.rawDiscountAmount);
      expect(result.voucher!.quantity).toEqual(purchaseOrder.voucher!.quantity);
      expect(result.voucher!.type).toEqual(purchaseOrder.voucher!.type);
      expect(result.voucher!.createdAt).toEqual(purchaseOrder.voucher!.createdAt);
      expect(result.voucher!.expiresAt).toEqual(purchaseOrder.voucher!.expiresAt);
      expect(result.voucher!.usedAt).toEqual(null);

      purchaseOrder!.items.forEach((item, idx) => {
        expect(item.id).toEqual(fakePurchaseOrder.items[idx]._id);
        expect(item.product.id).toEqual(fakePurchaseOrder.items[idx].product._id);
        expect(item.product.name).toEqual(fakePurchaseOrder.items[idx].product.name);
        expect(item.product.amount).toEqual(fakePurchaseOrder.items[idx].product.amount);
        expect(item.quantity).toEqual(fakePurchaseOrder.items[idx].quantity);
        expect(item.purchaseOrderId)
          .toEqual(fakePurchaseOrder.items[idx].purchaseOrder);
      });

      expect(PurchaseOrderModelMock.findOne).toHaveBeenCalledWith({ _id: fakePurchaseOrder._id });
      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(PurchaseOrderModelMock.populate.mock.calls[0][1]).toEqual({ path: 'voucher', model: VoucherModel });
    });
  });

  describe('MongoPurchaseOrderRepository.getPurchaseOrderItemById()', () => {
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

      const repository = new MongoPurchaseOrderRepository();

      const purchaseOrderItem = await repository
        .getPurchaseOrderItemById(fakePurchaseOrderItem._id);

      expect(purchaseOrderItem!.id).toEqual(fakePurchaseOrderItem._id);
      expect(purchaseOrderItem!.quantity).toEqual(fakePurchaseOrderItem.quantity);
      expect(purchaseOrderItem!.product).toEqual(new Product(
        fakePurchaseOrderItem.product._id,
        fakePurchaseOrderItem.product.name,
        fakePurchaseOrderItem.product.amount,
      ));

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

      PurchaseOrderItemModelMock.findOne.mockClear();

      const fakePurchaseOrderItemId = faker.datatype.uuid();

      PurchaseOrderItemModelMock.findOne.mockResolvedValueOnce(null);

      const repository = new MongoPurchaseOrderRepository();

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
  });

  describe('MongoPurchaseOrderRepository.getPurchaseOrderItem()', () => {
    it('gets a purchase order item by purchase order id and product id', async () => {
      expect.assertions(5);

      PurchaseOrderItemModelMock.findOne.mockClear();

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

      const repository = new MongoPurchaseOrderRepository();

      const purchaseOrderItem = await repository.getPurchaseOrderItem({
        purchaseOrderId: fakePurchaseOrderId,
        productId: fakePurchaseOrderItem.product._id,
      });

      expect(purchaseOrderItem!.id).toEqual(fakePurchaseOrderItem._id);
      expect(purchaseOrderItem!.quantity).toEqual(fakePurchaseOrderItem.quantity);
      expect(purchaseOrderItem!.purchaseOrderId).toEqual(fakePurchaseOrderItem.purchaseOrder);
      expect(purchaseOrderItem!.product).toEqual(new Product(
        fakePurchaseOrderItem.product._id,
        fakePurchaseOrderItem.product.name,
        fakePurchaseOrderItem.product.amount,
      ));

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
  });

  describe('MongoPurchaseOrderRepository.addPurchaseOrderItem()', () => {
    it('creates a new purchase order item', async () => {
      expect.assertions(6);

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

      const populateProductMock = jest.fn().mockResolvedValue(fakePurchaseOrderItem);

      PurchaseOrderItemModelMock.create
        .mockImplementationOnce(() => Promise.resolve({ populate: populateProductMock }));

      const repository = new MongoPurchaseOrderRepository();

      const purchaseOrderItem = await repository.addPurchaseOrderItem(
        new PurchaseOrderItem({
          id: fakePurchaseOrderItem._id,
          purchaseOrderId: fakePurchaseOrderItem.purchaseOrder,
          quantity: fakePurchaseOrderItem.quantity,
          product: new Product(
            fakePurchaseOrderItem.product._id,
            fakePurchaseOrderItem.product.name,
            fakePurchaseOrderItem.product.amount,
          ),
        }),
      );

      expect(purchaseOrderItem!.id).toEqual(fakePurchaseOrderItem._id);
      expect(purchaseOrderItem!.quantity).toEqual(fakePurchaseOrderItem.quantity);
      expect(purchaseOrderItem!.purchaseOrderId).toEqual(fakePurchaseOrderItem.purchaseOrder);
      expect(purchaseOrderItem!.product).toEqual(new Product(
        fakePurchaseOrderItem.product._id,
        fakePurchaseOrderItem.product.name,
        fakePurchaseOrderItem.product.amount,
      ));

      expect(PurchaseOrderItemModelMock.create).toHaveBeenCalledWith({
        _id: purchaseOrderItem.id,
        purchaseOrder: purchaseOrderItem.purchaseOrderId,
        quantity: purchaseOrderItem.quantity,
        product: purchaseOrderItem.product.id,
      });
      expect(populateProductMock).toHaveBeenCalledWith({
        path: 'product',
        select: '_id name amount',
        model: ProductModel,
      });
    });
  });

  describe('MongoPurchaseOrderRepository.updatePurchaseOrderItem()', () => {
    it('updates a specific purchase order item', async () => {
      expect.assertions(5);

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

      const repository = new MongoPurchaseOrderRepository();

      const purchaseOrderItem = await repository.updatePurchaseOrderItem(
        new PurchaseOrderItem({
          id: fakePurchaseOrderItem._id,
          purchaseOrderId: fakePurchaseOrderItem.purchaseOrder,
          quantity: fakePurchaseOrderItem.quantity,
          product: new Product(
            fakePurchaseOrderItem.product._id,
            fakePurchaseOrderItem.product.name,
            fakePurchaseOrderItem.product.amount,
          ),
        }),
      );

      expect(purchaseOrderItem!.id).toEqual(fakePurchaseOrderItem._id);
      expect(purchaseOrderItem!.quantity).toEqual(fakePurchaseOrderItem.quantity);
      expect(purchaseOrderItem!.purchaseOrderId).toEqual(fakePurchaseOrderItem.purchaseOrder);
      expect(purchaseOrderItem!.product).toEqual(new Product(
        fakePurchaseOrderItem.product._id,
        fakePurchaseOrderItem.product.name,
        fakePurchaseOrderItem.product.amount,
      ));

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
  });

  describe('MongoPurchaseOrderRepository.deletePurchaseOrderItem()', () => {
    it('deletes a purchas order item by id', async () => {
      expect.assertions(2);

      const fakePurchaseOrderItemId = faker.datatype.uuid();

      const repository = new MongoPurchaseOrderRepository();

      PurchaseOrderItemModelMock.deleteOne.mockResolvedValueOnce({ deletedCount: 1 } as any);

      const result = await repository.deletePurchaseOrderItem(fakePurchaseOrderItemId);

      expect(result).toBe(true);
      expect(PurchaseOrderItemModelMock.deleteOne).toHaveBeenCalledWith({
        _id: fakePurchaseOrderItemId,
      });
    });
  });

  describe('MongoPurchaseOrderRepository.getVoucherByCode()', () => {
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

      const repository = new MongoPurchaseOrderRepository();

      const voucher = await repository.getVoucherByCode(fakeVoucher.code);

      expect(voucher!.id).toEqual(fakeVoucher._id);
      expect(voucher!.code).toEqual(fakeVoucher.code);
      expect(voucher!.percentageAmount).toEqual(fakeVoucher.percentageAmount);
      expect(voucher!.rawDiscountAmount).toEqual(fakeVoucher.rawDiscountAmount);
      expect(voucher!.quantity).toEqual(fakeVoucher.quantity);
      expect(voucher!.type).toEqual(fakeVoucher.type);
      expect(voucher!.createdAt).toEqual(fakeVoucher.createdAt);
      expect(voucher!.expiresAt).toEqual(fakeVoucher.expiresAt);
      expect(voucher!.usedAt).toBeNull();

      expect(VoucherModelMock.findOne).toHaveBeenCalledWith({ code: fakeVoucher.code });
    });

    it("returns null if voucher doesn't exist", async () => {
      expect.assertions(2);

      VoucherModelMock.findOne.mockClear();

      const fakeVoucherCode = parseInt(faker.datatype.number().toString(), 10);

      VoucherModelMock.findOne.mockResolvedValueOnce(null);

      const repository = new MongoPurchaseOrderRepository();

      const voucher = await repository.getVoucherByCode(fakeVoucherCode);

      expect(voucher).toBeNull();
      expect(VoucherModelMock.findOne).toHaveBeenCalledWith({ code: fakeVoucherCode });
    });
  });
});
