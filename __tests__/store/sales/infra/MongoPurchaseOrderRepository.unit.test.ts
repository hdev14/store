import { faker } from '@faker-js/faker';
import PurchaseOrder, { PurchaseOrderStatus } from '@sales/domain/PurchaseOrder';
import Voucher, { VoucherDiscountTypes } from '@sales/domain/Voucher';
import MongoPurchaseOrderRepository from '@sales/infra/persistence/MongoPurchaseOrderRepository';
import PurchaseOrderModel from '@mongoose/PurchaseOrderModel';
import PurchaseOrderItemModel from '@mongoose/PurchaseOrderItemModel';
import ProductModel from '@mongoose/ProductModel';
import VoucherModel from '@mongoose/VoucherModel';
import UserModel from '@mongoose/UserModel';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import Product from '@sales/domain/Product';

jest.mock('../../../../mongoose/PurchaseOrderModel');
jest.mock('../../../../mongoose/PurchaseOrderItemModel');
jest.mock('../../../../mongoose/VoucherModel');
jest.mock('../../../../mongoose/ProductModel');
jest.mock('../../../../mongoose/UserModel');

const PurchaseOrderModelMock = jest.mocked(PurchaseOrderModel, true);
const PurchaseOrderItemModelMock = jest.mocked(PurchaseOrderItemModel, true);
const ProductModelMock = jest.mocked(ProductModel, true);
const VoucherModelMock = jest.mocked(VoucherModel, true);
const UserModelMock = jest.mocked(UserModel, true);

describe("MongoPurchaseOrderRepository's unit tests", () => {
  describe('PrismaPurchaseOrderRepository.getPurchaseOrderById()', () => {
    it('returns a purchase order by id', async () => {
      expect.assertions(34);

      const purchaseOrderId = faker.datatype.uuid();

      const fakePurchaseOrder = {
        id: purchaseOrderId,
        client: {
          id: faker.datatype.uuid(),
        },
        code: parseInt(faker.datatype.number().toString(), 10),
        status: PurchaseOrderStatus.STARTED,
        totalAmount: faker.datatype.float(),
        discountAmount: 0,
        createdAt: new Date(),
        voucher: {
          id: faker.datatype.uuid(),
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
            id: faker.datatype.uuid(),
            quantity: parseInt(faker.datatype.number().toString(), 10),
            purchaseOrderId,
            product: {
              id: faker.datatype.uuid(),
              name: faker.commerce.product(),
              amount: faker.datatype.float(),
            },
          },
          {
            id: faker.datatype.uuid(),
            quantity: parseInt(faker.datatype.number().toString(), 10),
            purchaseOrderId,
            product: {
              id: faker.datatype.uuid(),
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

      const populateClientMock = jest.fn()
        .mockImplementation(() => ({ populate: populateVoucherMock } as any));

      PurchaseOrderModelMock.findOne
        .mockImplementationOnce(() => ({ populate: populateClientMock } as any));

      const repository = new MongoPurchaseOrderRepository();

      const purchaseOrder = await repository.getPurchaseOrderById(purchaseOrderId);

      expect(purchaseOrder!.id).toEqual(fakePurchaseOrder.id);
      expect(purchaseOrder!.clientId).toEqual(fakePurchaseOrder.client.id);
      expect(purchaseOrder!.code).toEqual(fakePurchaseOrder.code);
      expect(purchaseOrder!.createdAt).toEqual(fakePurchaseOrder.createdAt);
      expect(purchaseOrder!.discountAmount).toEqual(fakePurchaseOrder.discountAmount);
      expect(purchaseOrder!.voucher!.id).toEqual(fakePurchaseOrder.voucher.id);
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
        expect(item.id).toEqual(fakePurchaseOrder.items[index].id);
        expect(item.product.id).toEqual(fakePurchaseOrder.items[index].product.id);
        expect(item.product.name).toEqual(fakePurchaseOrder.items[index].product.name);
        expect(item.product.amount).toEqual(fakePurchaseOrder.items[index].product.amount);
        expect(item.quantity).toEqual(fakePurchaseOrder.items[index].quantity);
        expect(item.purchaseOrderId).toEqual(fakePurchaseOrder.items[index].purchaseOrderId);
      });

      expect(PurchaseOrderModelMock.findOne).toHaveBeenCalledTimes(1);
      expect(PurchaseOrderModelMock.findOne).toHaveBeenCalledWith({ id: purchaseOrderId });
      expect(populateItemsMock).toHaveBeenCalledTimes(1);
      expect(populateClientMock).toHaveBeenCalledTimes(1);
      expect(populateVoucherMock).toHaveBeenCalledTimes(1);
      expect(populateVoucherMock).toHaveBeenCalledWith('voucher');
      expect(populateClientMock).toHaveBeenCalledWith('client');
      expect(populateItemsMock).toHaveBeenCalledWith({
        path: 'items',
        populate: {
          path: 'product',
          select: 'id name amount',
        },
      });
    });
  });

  describe('PrismaPurchaseOrderRepository.getPurchaseOrdersByClientId()', () => {
    it('returns purchase orders by client id', async () => {
      UserModelMock.mockClear();

      expect.assertions(36);

      const clientId = faker.datatype.uuid();
      const purchaseOrderId = faker.datatype.uuid();

      const fakePurchaseOrders = [{
        id: purchaseOrderId,
        client: {
          id: clientId,
        },
        code: parseInt(faker.datatype.number().toString(), 10),
        status: PurchaseOrderStatus.STARTED,
        totalAmount: faker.datatype.float(),
        discountAmount: 0,
        createdAt: new Date(),
        voucher: {
          id: faker.datatype.uuid(),
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
            id: faker.datatype.uuid(),
            quantity: parseInt(faker.datatype.number().toString(), 10),
            purchaseOrderId,
            product: {
              id: faker.datatype.uuid(),
              name: faker.commerce.product(),
              amount: faker.datatype.float(),
            },
          },
          {
            id: faker.datatype.uuid(),
            quantity: parseInt(faker.datatype.number().toString(), 10),
            purchaseOrderId,
            product: {
              id: faker.datatype.uuid(),
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

      const populateClientMock = jest.fn()
        .mockImplementation(() => ({ populate: populateVoucherMock } as any));

      PurchaseOrderModelMock.find
        .mockImplementationOnce(() => ({ populate: populateClientMock } as any));

      UserModelMock.findOne.mockResolvedValueOnce({ _id: 'test' } as any);

      const repository = new MongoPurchaseOrderRepository();

      const purchaseOrders = await repository.getPurchaseOrdersByClientId(clientId);

      purchaseOrders.forEach((purchaseOrder, index) => {
        expect(purchaseOrder!.id).toEqual(fakePurchaseOrders[index].id);
        expect(purchaseOrder!.clientId).toEqual(fakePurchaseOrders[index].client.id);
        expect(purchaseOrder!.code).toEqual(fakePurchaseOrders[index].code);
        expect(purchaseOrder!.createdAt).toEqual(fakePurchaseOrders[index].createdAt);
        expect(purchaseOrder!.discountAmount).toEqual(fakePurchaseOrders[index].discountAmount);
        expect(purchaseOrder!.voucher!.id).toEqual(fakePurchaseOrders[index].voucher.id);
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
          expect(item.id).toEqual(fakePurchaseOrders[index].items[idx].id);
          expect(item.product.id).toEqual(fakePurchaseOrders[index].items[idx].product.id);
          expect(item.product.name).toEqual(fakePurchaseOrders[index].items[idx].product.name);
          expect(item.product.amount).toEqual(fakePurchaseOrders[index].items[idx].product.amount);
          expect(item.quantity).toEqual(fakePurchaseOrders[index].items[idx].quantity);
          expect(item.purchaseOrderId)
            .toEqual(fakePurchaseOrders[index].items[idx].purchaseOrderId);
        });
      });

      expect(UserModelMock.findOne).toHaveBeenCalledTimes(1);
      expect(UserModelMock.findOne).toHaveBeenCalledWith({ id: clientId });
      expect(PurchaseOrderModelMock.find).toHaveBeenCalledTimes(1);
      expect(PurchaseOrderModelMock.find).toHaveBeenCalledWith(
        { client: 'test' },
      );
      expect(populateItemsMock).toHaveBeenCalledTimes(1);
      expect(populateClientMock).toHaveBeenCalledTimes(1);
      expect(populateVoucherMock).toHaveBeenCalledTimes(1);
      expect(populateVoucherMock).toHaveBeenCalledWith('voucher');
      expect(populateClientMock).toHaveBeenCalledWith('client');
      expect(populateItemsMock).toHaveBeenCalledWith({
        path: 'items',
        populate: {
          path: 'product',
          select: 'id name amount',
        },
      });
    });
  });

  describe('PrismaPurchaseOrderRepository.getDraftPurchaseOrderByClientId()', () => {
    it('returns a draft purchase order by client id', async () => {
      expect.assertions(19);

      UserModelMock.findOne.mockClear();
      PurchaseOrderModelMock.findOne.mockClear();

      const clientId = faker.datatype.uuid();
      const purchaseOrderId = faker.datatype.uuid();

      const fakeDraftPurchaseOrder = {
        id: purchaseOrderId,
        client: {
          id: clientId,
        },
        code: parseInt(faker.datatype.number().toString(), 10),
        status: PurchaseOrderStatus.DRAFT,
        totalAmount: 0,
        discountAmount: 0,
        createdAt: new Date(),
        voucher: null,
        items: [
          {
            id: faker.datatype.uuid(),
            quantity: parseInt(faker.datatype.number().toString(), 10),
            purchaseOrderId,
            product: {
              id: faker.datatype.uuid(),
              name: faker.commerce.product(),
              amount: faker.datatype.float(),
            },
          },
        ],
      };

      const populateItemsMock = jest.fn()
        .mockImplementation(() => Promise.resolve(fakeDraftPurchaseOrder));

      const populateClientMock = jest.fn()
        .mockImplementation(() => ({ populate: populateItemsMock } as any));

      PurchaseOrderModelMock.findOne
        .mockImplementationOnce(() => ({ populate: populateClientMock } as any));

      UserModelMock.findOne.mockResolvedValueOnce({ _id: 'test' } as any);

      const repository = new MongoPurchaseOrderRepository();

      const purchaseOrder = await repository.getDraftPurchaseOrderByClientId(clientId);

      expect(purchaseOrder!.id).toEqual(fakeDraftPurchaseOrder.id);
      expect(purchaseOrder!.clientId).toEqual(fakeDraftPurchaseOrder.client.id);
      expect(purchaseOrder!.code).toEqual(fakeDraftPurchaseOrder.code);
      expect(purchaseOrder!.createdAt).toEqual(fakeDraftPurchaseOrder.createdAt);
      expect(purchaseOrder!.discountAmount).toEqual(fakeDraftPurchaseOrder.discountAmount);

      purchaseOrder!.items.forEach((item, idx) => {
        expect(item.id).toEqual(fakeDraftPurchaseOrder.items[idx].id);
        expect(item.product.id).toEqual(fakeDraftPurchaseOrder.items[idx].product.id);
        expect(item.product.name).toEqual(fakeDraftPurchaseOrder.items[idx].product.name);
        expect(item.product.amount).toEqual(fakeDraftPurchaseOrder.items[idx].product.amount);
        expect(item.quantity).toEqual(fakeDraftPurchaseOrder.items[idx].quantity);
        expect(item.purchaseOrderId)
          .toEqual(fakeDraftPurchaseOrder.items[idx].purchaseOrderId);
      });

      expect(UserModelMock.findOne).toHaveBeenCalledTimes(1);
      expect(UserModelMock.findOne).toHaveBeenCalledWith({ id: clientId });
      expect(PurchaseOrderModelMock.findOne).toHaveBeenCalledTimes(1);
      expect(PurchaseOrderModelMock.findOne).toHaveBeenCalledWith({
        client: 'test', status: PurchaseOrderStatus.DRAFT,
      });
      expect(populateItemsMock).toHaveBeenCalledTimes(1);
      expect(populateClientMock).toHaveBeenCalledTimes(1);
      expect(populateClientMock).toHaveBeenCalledWith('client');
      expect(populateItemsMock).toHaveBeenCalledWith({
        path: 'items',
        populate: {
          path: 'product',
          select: 'id name amount',
        },
      });
    });
  });

  describe('PrismaPurchaseOrderRepository.addPurchaseOrder()', () => {
    it('creates a new purchase order', async () => {
      expect.assertions(31);

      UserModelMock.findOne.mockClear();
      VoucherModelMock.findOne.mockClear();
      PurchaseOrderItemModelMock.find.mockClear();

      const clientId = faker.datatype.uuid();
      const purchaseOrderId = faker.datatype.uuid();

      const fakePurchaseOrder = {
        id: purchaseOrderId,
        client: {
          id: clientId,
        },
        code: parseInt(faker.datatype.number().toString(), 10),
        status: PurchaseOrderStatus.DRAFT,
        totalAmount: 0,
        discountAmount: 0,
        createdAt: new Date(),
        voucher: {
          id: faker.datatype.uuid(),
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
            id: faker.datatype.uuid(),
            quantity: parseInt(faker.datatype.number().toString(), 10),
            purchaseOrderId,
            product: {
              id: faker.datatype.uuid(),
              name: faker.commerce.product(),
              amount: faker.datatype.float(),
            },
          },
        ],
      };

      UserModelMock.findOne
        .mockResolvedValueOnce({ _id: 'user_test' });

      VoucherModelMock.findOne
        .mockResolvedValueOnce({ _id: 'voucher_test' });

      PurchaseOrderItemModelMock.find
        .mockResolvedValueOnce([{ _id: 'purchaser_order_item_test' }]);

      PurchaseOrderModelMock.create
        .mockImplementationOnce(() => Promise.resolve(fakePurchaseOrder as any));

      PurchaseOrderModelMock.populate
        .mockImplementationOnce(() => Promise.resolve(fakePurchaseOrder as any));

      const purchaseOrder = new PurchaseOrder({
        id: fakePurchaseOrder.id,
        clientId: fakePurchaseOrder.client.id,
        code: fakePurchaseOrder.code,
        status: fakePurchaseOrder.status,
        voucher: new Voucher({
          id: fakePurchaseOrder.voucher.id,
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
        id: fakePurchaseOrder.items[0].id,
        quantity: fakePurchaseOrder.items[0].quantity,
        product: new Product(
          fakePurchaseOrder.items[0].product.id,
          fakePurchaseOrder.items[0].product.name,
          fakePurchaseOrder.items[0].product.amount,
        ),
      }));

      const repository = new MongoPurchaseOrderRepository();

      const result = await repository.addPurchaseOrder(purchaseOrder);

      expect(result.id).toEqual(purchaseOrder.id);
      expect(result.clientId).toEqual(purchaseOrder.clientId);
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
        expect(item.id).toEqual(fakePurchaseOrder.items[idx].id);
        expect(item.product.id).toEqual(fakePurchaseOrder.items[idx].product.id);
        expect(item.product.name).toEqual(fakePurchaseOrder.items[idx].product.name);
        expect(item.product.amount).toEqual(fakePurchaseOrder.items[idx].product.amount);
        expect(item.quantity).toEqual(fakePurchaseOrder.items[idx].quantity);
        expect(item.purchaseOrderId)
          .toEqual(fakePurchaseOrder.items[idx].purchaseOrderId);
      });

      expect(UserModelMock.findOne).toHaveBeenCalledTimes(1);
      expect(UserModelMock.findOne).toHaveBeenCalledWith({ id: fakePurchaseOrder.client.id });
      expect(VoucherModelMock.findOne).toHaveBeenCalledTimes(1);
      expect(VoucherModelMock.findOne).toHaveBeenCalledWith({ id: fakePurchaseOrder.voucher.id });
      expect(PurchaseOrderItemModelMock.find).toHaveBeenCalledTimes(1);
      expect(PurchaseOrderItemModelMock.find).toHaveBeenCalledWith({
        id: { $in: [fakePurchaseOrder.items[0].id] },
      });
      expect(PurchaseOrderModelMock.populate).toHaveBeenCalledTimes(1);
      expect(PurchaseOrderModelMock.populate).toHaveBeenCalledWith(fakePurchaseOrder, { path: 'voucher' });
      expect(PurchaseOrderModelMock.create).toHaveBeenCalledTimes(1);
      expect(PurchaseOrderModelMock.create).toHaveBeenCalledWith({
        id: purchaseOrder.id,
        client: 'user_test',
        code: purchaseOrder.code,
        status: purchaseOrder.status,
        totalAmount: purchaseOrder.totalAmount,
        discountAmount: purchaseOrder.discountAmount,
        createdAt: purchaseOrder.createdAt,
        voucher: 'voucher_test',
        items: ['purchaser_order_item_test'],
      });
    });

    it('creates a new purchase order without voucher', async () => {
      expect.assertions(21);

      UserModelMock.findOne.mockClear();
      VoucherModelMock.findOne.mockClear();
      PurchaseOrderItemModelMock.find.mockClear();
      PurchaseOrderModelMock.populate.mockClear();
      PurchaseOrderModelMock.create.mockClear();

      const clientId = faker.datatype.uuid();
      const purchaseOrderId = faker.datatype.uuid();

      const fakePurchaseOrder = {
        id: purchaseOrderId,
        client: {
          id: clientId,
        },
        code: parseInt(faker.datatype.number().toString(), 10),
        status: PurchaseOrderStatus.STARTED,
        totalAmount: 0,
        discountAmount: 0,
        createdAt: new Date(),
        voucher: null,
        items: [
          {
            id: faker.datatype.uuid(),
            quantity: parseInt(faker.datatype.number().toString(), 10),
            purchaseOrderId,
            product: {
              id: faker.datatype.uuid(),
              name: faker.commerce.product(),
              amount: faker.datatype.float(),
            },
          },
        ],
      };

      UserModelMock.findOne
        .mockResolvedValueOnce({ _id: 'user_test' });

      PurchaseOrderItemModelMock.find
        .mockResolvedValueOnce([{ _id: 'purchaser_order_item_test' }]);

      PurchaseOrderModelMock.create
        .mockImplementationOnce(() => Promise.resolve(fakePurchaseOrder as any));

      PurchaseOrderModelMock.populate
        .mockImplementationOnce(() => Promise.resolve(fakePurchaseOrder as any));

      const purchaseOrder = new PurchaseOrder({
        id: fakePurchaseOrder.id,
        clientId: fakePurchaseOrder.client.id,
        code: fakePurchaseOrder.code,
        status: fakePurchaseOrder.status,
        voucher: null,
        createdAt: fakePurchaseOrder.createdAt,
      });

      purchaseOrder.addItem(new PurchaseOrderItem({
        id: fakePurchaseOrder.items[0].id,
        quantity: fakePurchaseOrder.items[0].quantity,
        product: new Product(
          fakePurchaseOrder.items[0].product.id,
          fakePurchaseOrder.items[0].product.name,
          fakePurchaseOrder.items[0].product.amount,
        ),
      }));

      const repository = new MongoPurchaseOrderRepository();

      const result = await repository.addPurchaseOrder(purchaseOrder);

      expect(result.id).toEqual(purchaseOrder.id);
      expect(result.clientId).toEqual(purchaseOrder.clientId);
      expect(result.code).toEqual(purchaseOrder.code);
      expect(result.createdAt).toEqual(purchaseOrder.createdAt);
      expect(result.discountAmount).toEqual(purchaseOrder.discountAmount);
      expect(result.voucher).toBeNull();

      purchaseOrder!.items.forEach((item, idx) => {
        expect(item.id).toEqual(fakePurchaseOrder.items[idx].id);
        expect(item.product.id).toEqual(fakePurchaseOrder.items[idx].product.id);
        expect(item.product.name).toEqual(fakePurchaseOrder.items[idx].product.name);
        expect(item.product.amount).toEqual(fakePurchaseOrder.items[idx].product.amount);
        expect(item.quantity).toEqual(fakePurchaseOrder.items[idx].quantity);
        expect(item.purchaseOrderId)
          .toEqual(fakePurchaseOrder.items[idx].purchaseOrderId);
      });

      expect(UserModelMock.findOne).toHaveBeenCalledTimes(1);
      expect(UserModelMock.findOne).toHaveBeenCalledWith({ id: fakePurchaseOrder.client.id });
      expect(VoucherModelMock.findOne).toHaveBeenCalledTimes(0);
      expect(PurchaseOrderItemModelMock.find).toHaveBeenCalledTimes(1);
      expect(PurchaseOrderItemModelMock.find).toHaveBeenCalledWith({
        id: { $in: [fakePurchaseOrder.items[0].id] },
      });
      expect(PurchaseOrderModelMock.populate).toHaveBeenCalledTimes(1);
      expect(PurchaseOrderModelMock.populate).toHaveBeenCalledWith(fakePurchaseOrder, { path: 'voucher' });
      expect(PurchaseOrderModelMock.create).toHaveBeenCalledTimes(1);
      expect(PurchaseOrderModelMock.create).toHaveBeenCalledWith({
        id: purchaseOrder.id,
        client: 'user_test',
        code: purchaseOrder.code,
        status: purchaseOrder.status,
        totalAmount: purchaseOrder.totalAmount,
        discountAmount: purchaseOrder.discountAmount,
        createdAt: purchaseOrder.createdAt,
        voucher: undefined,
        items: ['purchaser_order_item_test'],
      });
    });
  });

  // describe('PrismaPurchaseOrderRepository.updatePurchaseOrder()', () => {
  //   it('updates a specific purchase order', async () => {
  //     expect.assertions(8);

  //     const clientId = faker.datatype.uuid();
  //     const purchaseOrderId = faker.datatype.uuid();

  //     const fakePurchaseOrder = {
  //       id: purchaseOrderId,
  //       clientId,
  //       code: parseInt(faker.datatype.number().toString(), 10),
  //       status: PurchaseOrderStatus.DRAFT,
  //       totalAmount: 0,
  //       discountAmount: 0,
  //       createdAt: new Date(),
  //       voucher: null,
  //       items: [
  //         {
  //           id: faker.datatype.uuid(),
  //           quantity: parseInt(faker.datatype.number().toString(), 10),
  //           purchaseOrderId,
  //           product: {
  //             id: faker.datatype.uuid(),
  //             name: faker.commerce.product(),
  //             amount: faker.datatype.float(),
  //           },
  //         },
  //       ],
  //     };

  //     prismaMock.purchaseOrder.update.mockResolvedValueOnce(fakePurchaseOrder as any);

  //     const purchaseOrder = new PurchaseOrder({
  //       id: fakePurchaseOrder.id,
  //       clientId: fakePurchaseOrder.clientId,
  //       code: fakePurchaseOrder.code,
  //       status: fakePurchaseOrder.status,
  //       voucher: null,
  //       createdAt: fakePurchaseOrder.createdAt,
  //     });

  //     const repository = new PrismaPurchaseOrderRepository();

  //     const result = await repository.updatePurchaseOrder(purchaseOrder);

  //     expect(result.id).toEqual(purchaseOrder.id);
  //     expect(result.clientId).toEqual(purchaseOrder.clientId);
  //     expect(result.code).toEqual(purchaseOrder.code);
  //     expect(result.createdAt).toEqual(purchaseOrder.createdAt);
  //     expect(result.discountAmount).toEqual(purchaseOrder.discountAmount);
  //     expect(result.voucher).toBe(null);

  //     expect(prismaMock.purchaseOrder.update).toHaveBeenCalledTimes(1);
  //     expect(prismaMock.purchaseOrder.update).toHaveBeenCalledWith({
  //       where: { id: fakePurchaseOrder.id },
  //       data: {
  //         clientId: fakePurchaseOrder.clientId,
  //         code: fakePurchaseOrder.code,
  //         status: fakePurchaseOrder.status,
  //         voucherId: undefined,
  //         totalAmount: fakePurchaseOrder.totalAmount,
  //         discountAmount: fakePurchaseOrder.discountAmount,
  //       },
  //       include: {
  //         voucher: true,
  //         items: {
  //           include: {
  //             product: {
  //               select: {
  //                 id: true,
  //                 name: true,
  //                 amount: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     });
  //   });
  // });

  // describe('PrismaPurchaseOrderRepository.getPurchaseOrderItemById()', () => {
  //   it('returns a purchase order item by id', async () => {
  //     expect.assertions(7);

  //     const fakePurchaseOrderItem = {
  //       id: faker.datatype.uuid(),
  //       quantity: parseInt(faker.datatype.number().toString(), 10),
  //       purchaseOrderId: faker.datatype.uuid(),
  //       product: {
  //         id: faker.datatype.uuid(),
  //         name: faker.commerce.product(),
  //         amount: faker.datatype.float(),
  //       },
  //     };

  //     prismaMock.purchaseOrderItem.findUnique.mockResolvedValueOnce(fakePurchaseOrderItem as any);

  //     const repository = new PrismaPurchaseOrderRepository();

  //     const purchaseOrderItem = await repository.getPurchaseOrderItemById(fakePurchaseOrderItem.id);

  //     expect(purchaseOrderItem!.id).toEqual(fakePurchaseOrderItem.id);
  //     expect(purchaseOrderItem!.quantity).toEqual(fakePurchaseOrderItem.quantity);
  //     expect(purchaseOrderItem!.purchaseOrderId).toEqual(fakePurchaseOrderItem.purchaseOrderId);
  //     expect(purchaseOrderItem!.purchaseOrderId).toEqual(fakePurchaseOrderItem.purchaseOrderId);
  //     expect(purchaseOrderItem!.product).toEqual(new Product(
  //       fakePurchaseOrderItem.product.id,
  //       fakePurchaseOrderItem.product.name,
  //       fakePurchaseOrderItem.product.amount,
  //     ));

  //     expect(prismaMock.purchaseOrderItem.findUnique).toHaveBeenCalledTimes(1);
  //     expect(prismaMock.purchaseOrderItem.findUnique).toHaveBeenCalledWith({
  //       where: { id: fakePurchaseOrderItem.id },
  //       include: {
  //         product: {
  //           select: {
  //             id: true,
  //             name: true,
  //             amount: true,
  //           },
  //         },
  //       },
  //     });
  //   });

  //   it("returns null if purchase order item doesn't exist", async () => {
  //     expect.assertions(3);

  //     const fakePurchaseOrderItemId = faker.datatype.uuid();

  //     prismaMock.purchaseOrderItem.findUnique.mockResolvedValueOnce(null);

  //     const repository = new PrismaPurchaseOrderRepository();

  //     const purchaseOrderItem = await repository.getPurchaseOrderItemById(fakePurchaseOrderItemId);

  //     expect(purchaseOrderItem).toBeNull();

  //     expect(prismaMock.purchaseOrderItem.findUnique).toHaveBeenCalledTimes(1);
  //     expect(prismaMock.purchaseOrderItem.findUnique).toHaveBeenCalledWith({
  //       where: { id: fakePurchaseOrderItemId },
  //       include: {
  //         product: {
  //           select: {
  //             id: true,
  //             name: true,
  //             amount: true,
  //           },
  //         },
  //       },
  //     });
  //   });
  // });

  // describe('PrismaPurchaseOrderRepository.getPurchaseOrderItem()', () => {
  //   it('gets a purchase order item by purchase order id', async () => {
  //     expect.assertions(7);

  //     const fakePurchaseOrderId = faker.datatype.uuid();

  //     const fakePurchaseOrderItem = {
  //       id: faker.datatype.uuid(),
  //       quantity: parseInt(faker.datatype.number().toString(), 10),
  //       purchaseOrderId: fakePurchaseOrderId,
  //       product: {
  //         id: faker.datatype.uuid(),
  //         name: faker.commerce.product(),
  //         amount: faker.datatype.float(),
  //       },
  //     };

  //     prismaMock.purchaseOrderItem.findFirst.mockResolvedValueOnce(fakePurchaseOrderItem as any);

  //     const repository = new PrismaPurchaseOrderRepository();

  //     const purchaseOrderItem = await repository.getPurchaseOrderItem({
  //       purchaseOrderId: fakePurchaseOrderId,
  //     });

  //     expect(purchaseOrderItem!.id).toEqual(fakePurchaseOrderItem.id);
  //     expect(purchaseOrderItem!.quantity).toEqual(fakePurchaseOrderItem.quantity);
  //     expect(purchaseOrderItem!.purchaseOrderId).toEqual(fakePurchaseOrderItem.purchaseOrderId);
  //     expect(purchaseOrderItem!.purchaseOrderId).toEqual(fakePurchaseOrderItem.purchaseOrderId);
  //     expect(purchaseOrderItem!.product).toEqual(new Product(
  //       fakePurchaseOrderItem.product.id,
  //       fakePurchaseOrderItem.product.name,
  //       fakePurchaseOrderItem.product.amount,
  //     ));

  //     expect(prismaMock.purchaseOrderItem.findFirst).toHaveBeenCalledTimes(1);
  //     expect(prismaMock.purchaseOrderItem.findFirst).toHaveBeenCalledWith({
  //       where: { purchaseOrderId: fakePurchaseOrderId },
  //       include: {
  //         product: {
  //           select: {
  //             id: true,
  //             name: true,
  //             amount: true,
  //           },
  //         },
  //       },
  //     });
  //   });

  //   it('gets a purchase order item by product id', async () => {
  //     expect.assertions(7);

  //     const fakeProductId = faker.datatype.uuid();

  //     const fakePurchaseOrderItem = {
  //       id: faker.datatype.uuid(),
  //       quantity: parseInt(faker.datatype.number().toString(), 10),
  //       purchaseOrderId: faker.datatype.uuid(),
  //       product: {
  //         id: fakeProductId,
  //         name: faker.commerce.product(),
  //         amount: faker.datatype.float(),
  //       },
  //     };

  //     prismaMock.purchaseOrderItem.findFirst.mockResolvedValueOnce(fakePurchaseOrderItem as any);

  //     const repository = new PrismaPurchaseOrderRepository();

  //     const purchaseOrderItem = await repository.getPurchaseOrderItem({
  //       productId: fakeProductId,
  //     });

  //     expect(purchaseOrderItem!.id).toEqual(fakePurchaseOrderItem.id);
  //     expect(purchaseOrderItem!.quantity).toEqual(fakePurchaseOrderItem.quantity);
  //     expect(purchaseOrderItem!.purchaseOrderId).toEqual(fakePurchaseOrderItem.purchaseOrderId);
  //     expect(purchaseOrderItem!.purchaseOrderId).toEqual(fakePurchaseOrderItem.purchaseOrderId);
  //     expect(purchaseOrderItem!.product).toEqual(new Product(
  //       fakePurchaseOrderItem.product.id,
  //       fakePurchaseOrderItem.product.name,
  //       fakePurchaseOrderItem.product.amount,
  //     ));

  //     expect(prismaMock.purchaseOrderItem.findFirst).toHaveBeenCalledTimes(1);
  //     expect(prismaMock.purchaseOrderItem.findFirst).toHaveBeenCalledWith({
  //       where: { productId: fakeProductId },
  //       include: {
  //         product: {
  //           select: {
  //             id: true,
  //             name: true,
  //             amount: true,
  //           },
  //         },
  //       },
  //     });
  //   });

  //   it('throws a generic exception if neither purchaseOrderId or productId is passed', async () => {
  //     expect.assertions(1);

  //     const repository = new PrismaPurchaseOrderRepository();

  //     try {
  //       await repository.getPurchaseOrderItem({});
  //     } catch (e: any) {
  //       expect(e.message).toEqual('É preciso passar o ID do pedido ou do produto.');
  //     }
  //   });
  // });

  // describe('PrismaPurchaseOrderRepository.addPurchaseOrderItem()', () => {
  //   it('creates a new purchase order item', async () => {
  //     expect.assertions(7);

  //     const fakePurchaseOrderItem = {
  //       id: faker.datatype.uuid(),
  //       quantity: parseInt(faker.datatype.number().toString(), 10),
  //       purchaseOrderId: faker.datatype.uuid(),
  //       product: {
  //         id: faker.datatype.uuid(),
  //         name: faker.commerce.product(),
  //         amount: faker.datatype.float(),
  //       },
  //     };

  //     prismaMock.purchaseOrderItem.create.mockResolvedValueOnce(fakePurchaseOrderItem as any);

  //     const repository = new PrismaPurchaseOrderRepository();

  //     const purchaseOrderItem = await repository.addPurchaseOrderItem(
  //       new PurchaseOrderItem({
  //         id: fakePurchaseOrderItem.id,
  //         purchaseOrderId: fakePurchaseOrderItem.purchaseOrderId,
  //         quantity: fakePurchaseOrderItem.quantity,
  //         product: new Product(
  //           fakePurchaseOrderItem.product.id,
  //           fakePurchaseOrderItem.product.name,
  //           fakePurchaseOrderItem.product.amount,
  //         ),
  //       }),
  //     );

  //     expect(purchaseOrderItem!.id).toEqual(fakePurchaseOrderItem.id);
  //     expect(purchaseOrderItem!.quantity).toEqual(fakePurchaseOrderItem.quantity);
  //     expect(purchaseOrderItem!.purchaseOrderId).toEqual(fakePurchaseOrderItem.purchaseOrderId);
  //     expect(purchaseOrderItem!.purchaseOrderId).toEqual(fakePurchaseOrderItem.purchaseOrderId);
  //     expect(purchaseOrderItem!.product).toEqual(new Product(
  //       fakePurchaseOrderItem.product.id,
  //       fakePurchaseOrderItem.product.name,
  //       fakePurchaseOrderItem.product.amount,
  //     ));

  //     expect(prismaMock.purchaseOrderItem.create).toHaveBeenCalledTimes(1);
  //     expect(prismaMock.purchaseOrderItem.create).toHaveBeenCalledWith({
  //       data: {
  //         id: fakePurchaseOrderItem.id,
  //         purchaseOrderId: fakePurchaseOrderItem.purchaseOrderId,
  //         quantity: fakePurchaseOrderItem.quantity,
  //         productId: fakePurchaseOrderItem.product.id,
  //       },
  //       include: {
  //         product: {
  //           select: {
  //             id: true,
  //             name: true,
  //             amount: true,
  //           },
  //         },
  //       },
  //     });
  //   });
  // });

  // describe('PrismaPurchaseOrderRepository.updatePurchaseOrderItem()', () => {
  //   it('updates a specific purchase order item', async () => {
  //     expect.assertions(7);

  //     const fakePurchaseOrderItem = {
  //       id: faker.datatype.uuid(),
  //       quantity: parseInt(faker.datatype.number().toString(), 10),
  //       purchaseOrderId: faker.datatype.uuid(),
  //       product: {
  //         id: faker.datatype.uuid(),
  //         name: faker.commerce.product(),
  //         amount: faker.datatype.float(),
  //       },
  //     };

  //     prismaMock.purchaseOrderItem.update.mockResolvedValueOnce(fakePurchaseOrderItem as any);

  //     const repository = new PrismaPurchaseOrderRepository();

  //     const purchaseOrderItem = await repository.updatePurchaseOrderItem(
  //       new PurchaseOrderItem({
  //         id: fakePurchaseOrderItem.id,
  //         purchaseOrderId: fakePurchaseOrderItem.purchaseOrderId,
  //         quantity: fakePurchaseOrderItem.quantity,
  //         product: new Product(
  //           fakePurchaseOrderItem.product.id,
  //           fakePurchaseOrderItem.product.name,
  //           fakePurchaseOrderItem.product.amount,
  //         ),
  //       }),
  //     );

  //     expect(purchaseOrderItem!.id).toEqual(fakePurchaseOrderItem.id);
  //     expect(purchaseOrderItem!.quantity).toEqual(fakePurchaseOrderItem.quantity);
  //     expect(purchaseOrderItem!.purchaseOrderId).toEqual(fakePurchaseOrderItem.purchaseOrderId);
  //     expect(purchaseOrderItem!.purchaseOrderId).toEqual(fakePurchaseOrderItem.purchaseOrderId);
  //     expect(purchaseOrderItem!.product).toEqual(new Product(
  //       fakePurchaseOrderItem.product.id,
  //       fakePurchaseOrderItem.product.name,
  //       fakePurchaseOrderItem.product.amount,
  //     ));

  //     expect(prismaMock.purchaseOrderItem.update).toHaveBeenCalledTimes(1);
  //     expect(prismaMock.purchaseOrderItem.update).toHaveBeenCalledWith({
  //       where: { id: fakePurchaseOrderItem.id },
  //       data: {
  //         purchaseOrderId: fakePurchaseOrderItem.purchaseOrderId,
  //         quantity: fakePurchaseOrderItem.quantity,
  //         productId: fakePurchaseOrderItem.product.id,
  //       },
  //       include: {
  //         product: {
  //           select: {
  //             id: true,
  //             name: true,
  //             amount: true,
  //           },
  //         },
  //       },
  //     });
  //   });
  // });

  // describe('PrismaPurchaseOrderRepository.deletePurchaseOrderItem()', () => {
  //   it('deletes a purchas order item by id', async () => {
  //     expect.assertions(3);

  //     const fakePurchaseOrderItem = {
  //       id: faker.datatype.uuid(),
  //       quantity: parseInt(faker.datatype.number().toString(), 10),
  //       purchaseOrderId: faker.datatype.uuid(),
  //       product: {
  //         id: faker.datatype.uuid(),
  //         name: faker.commerce.product(),
  //         amount: faker.datatype.float(),
  //       },
  //     };

  //     prismaMock.purchaseOrderItem.delete.mockResolvedValueOnce(fakePurchaseOrderItem as any);

  //     const repository = new PrismaPurchaseOrderRepository();

  //     const result = await repository.deletePurchaseOrderItem(fakePurchaseOrderItem.id);

  //     expect(result).toBe(true);
  //     expect(prismaMock.purchaseOrderItem.delete).toHaveBeenCalledTimes(1);
  //     expect(prismaMock.purchaseOrderItem.delete).toHaveBeenCalledWith({
  //       where: { id: fakePurchaseOrderItem.id },
  //     });
  //   });

  //   it('returns FALSE if occur an expected error', async () => {
  //     expect.assertions(3);

  //     const fakePurchaseOrderItemId = faker.datatype.uuid();

  //     prismaMock.purchaseOrderItem.delete.mockRejectedValueOnce(new Error('Test'));

  //     const repository = new PrismaPurchaseOrderRepository();

  //     const result = await repository.deletePurchaseOrderItem(fakePurchaseOrderItemId);

  //     expect(result).toBe(false);
  //     expect(prismaMock.purchaseOrderItem.delete).toHaveBeenCalledTimes(1);
  //     expect(prismaMock.purchaseOrderItem.delete).toHaveBeenCalledWith({
  //       where: { id: fakePurchaseOrderItemId },
  //     });
  //   });
  // });

  // describe('PrismaPurchaseOrderRepository.getVoucherByCode()', () => {
  //   it('gets a voucher by code', async () => {
  //     expect.assertions(11);

  //     const fakeVoucher = {
  //       id: faker.datatype.uuid(),
  //       code: parseInt(faker.datatype.number().toString(), 10),
  //       percentageAmount: faker.datatype.float(),
  //       rawDiscountAmount: faker.datatype.float(),
  //       quantity: parseInt(faker.datatype.number().toString(), 10),
  //       type: VoucherDiscountTypes.ABSOLUTE,
  //       createdAt: new Date(),
  //       expiresAt: new Date(),
  //       active: faker.datatype.boolean(),
  //       usedAt: null,
  //     };

  //     prismaMock.voucher.findFirst.mockResolvedValueOnce(fakeVoucher as any);

  //     const repository = new PrismaPurchaseOrderRepository();

  //     const voucher = await repository.getVoucherByCode(fakeVoucher.code);

  //     expect(voucher!.id).toEqual(fakeVoucher.id);
  //     expect(voucher!.code).toEqual(fakeVoucher.code);
  //     expect(voucher!.percentageAmount).toEqual(fakeVoucher.percentageAmount);
  //     expect(voucher!.rawDiscountAmount).toEqual(fakeVoucher.rawDiscountAmount);
  //     expect(voucher!.quantity).toEqual(fakeVoucher.quantity);
  //     expect(voucher!.type).toEqual(fakeVoucher.type);
  //     expect(voucher!.createdAt).toEqual(fakeVoucher.createdAt);
  //     expect(voucher!.expiresAt).toEqual(fakeVoucher.expiresAt);
  //     expect(voucher!.usedAt).toBeNull();

  //     expect(prismaMock.voucher.findFirst).toHaveBeenCalledTimes(1);
  //     expect(prismaMock.voucher.findFirst).toHaveBeenCalledWith({
  //       where: { code: fakeVoucher.code },
  //     });
  //   });

  //   it("returns null if voucher doesn't exist", async () => {
  //     expect.assertions(3);

  //     const fakeVoucherCode = parseInt(faker.datatype.number().toString(), 10);

  //     prismaMock.voucher.findFirst.mockResolvedValueOnce(null);

  //     const repository = new PrismaPurchaseOrderRepository();

  //     const voucher = await repository.getVoucherByCode(fakeVoucherCode);

  //     expect(voucher).toBeNull();
  //     expect(prismaMock.voucher.findFirst).toHaveBeenCalledTimes(1);
  //     expect(prismaMock.voucher.findFirst).toHaveBeenCalledWith({
  //       where: { code: fakeVoucherCode },
  //     });
  //   });
  // });

  // describe('PrismaPurchaseOrderRepository.countPurchaseOrders()', () => {
  //   it('counts all the purchase orders', async () => {
  //     expect.assertions(2);

  //     const fakeQuantityOfPuchaseOrders = parseInt(faker.datatype.number().toString(), 10);

  //     prismaMock.purchaseOrder.count.mockResolvedValueOnce(fakeQuantityOfPuchaseOrders);

  //     const repository = new PrismaPurchaseOrderRepository();

  //     const result = await repository.countPurchaseOrders();

  //     expect(prismaMock.purchaseOrder.count).toHaveBeenCalledTimes(1);
  //     expect(result).toEqual(fakeQuantityOfPuchaseOrders);
  //   });
  // });

  // describe('PrismaPurchaseOrderRepository.countPurchaseOrderItems()', () => {
  //   it('counts all the purchase order items', async () => {
  //     expect.assertions(2);

  //     const fakeQuantityOfPuchaseOrderItems = parseInt(faker.datatype.number().toString(), 10);

  //     prismaMock.purchaseOrderItem.count.mockResolvedValueOnce(fakeQuantityOfPuchaseOrderItems);

  //     const repository = new PrismaPurchaseOrderRepository();

  //     const result = await repository.countPurchaseOrderItems();

  //     expect(prismaMock.purchaseOrderItem.count).toHaveBeenCalledTimes(1);
  //     expect(result).toEqual(fakeQuantityOfPuchaseOrderItems);
  //   });
  // });

  // describe('PrismaPurchaseOrderRepository.countVouchers()', () => {
  //   it('counts all the vouchers', async () => {
  //     expect.assertions(2);

  //     const fakeQuantityOfVouchers = parseInt(faker.datatype.number().toString(), 10);

  //     prismaMock.voucher.count.mockResolvedValueOnce(fakeQuantityOfVouchers);

  //     const repository = new PrismaPurchaseOrderRepository();

  //     const result = await repository.countVouchers();

  //     expect(prismaMock.voucher.count).toHaveBeenCalledTimes(1);
  //     expect(result).toEqual(fakeQuantityOfVouchers);
  //   });
  // });
});
