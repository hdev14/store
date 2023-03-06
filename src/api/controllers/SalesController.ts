import { NextFunction, Request, Response } from 'express';
import AddPurchaseOrderItemCommand from '@sales/app/commands/AddPurchaseOrderItemCommand';
import ValidationError from '@shared/errors/ValidationError';
import ApplyVoucherCommand from '@sales/app/commands/ApplyVoucherCommand';
import UpdatePurchaseOrderItemQuantityCommand from '@sales/app/commands/UpdatePurchaseOrderItemQuantityCommand';
import RemovePurchaseOrderItemCommand from '@sales/app/commands/RemovePurchaseOrderItemCommand';
import GetPurchaseOrderQuery from '@sales/app/queries/GetPurchaseOrderQuery';
import GetPurchaseOrderItemQuery from '@sales/app/queries/GetPurchaseOrderItemQuery';
import GetPurchaseOrdersQuery from '@sales/app/queries/GetPurchaseOrdersQuery';
import GetVoucherQuery from '@sales/app/queries/GetVoucherQuery';
import PurchaseOrderNotFoundError from '@sales/app/PurchaseOrderNotFoundError';
import PurchaseOrderItemNotFoundError from '@sales/app/PurchaseOrderItemNotFoundError';
import VoucherNotFoundError from '@sales/app/VoucherNotFoundError';
import IMediator from '@shared/abstractions/IMediator';
import VoucherInvalidError from '@sales/app/VoucherInvalidError';
import PurchaseOrderItemNotDeletedError from '@sales/app/PurchaseOrderItemNotDeletedError.ts';
import HttpStatusCodes from '@api/HttpStatusCodes';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import Voucher from '@sales/domain/Voucher';

export default class SalesController {
  constructor(private readonly mediator: IMediator) { }

  public async addPurchaseOrderItem(request: Request, response: Response, next: NextFunction) {
    try {
      const {
        customerId,
        productId,
        productName,
        productAmount,
        quantity,
      } = request.body;

      await this.mediator.send(new AddPurchaseOrderItemCommand(
        customerId,
        productId,
        productName,
        productAmount,
        quantity,
      ));

      return response.status(HttpStatusCodes.CREATED).json({
        message: 'Item adicionado ao pedido.',
      });
    } catch (e) {
      if (e instanceof ValidationError) {
        return response.status(HttpStatusCodes.BAD_REQUEST).send({ errors: e.errors });
      }

      return next(e);
    }
  }

  public async removePurchaseOrderItem(request: Request, response: Response, next: NextFunction) {
    try {
      await this.mediator.send(
        new RemovePurchaseOrderItemCommand(request.params.id),
      );

      return response.status(HttpStatusCodes.OK).json({ message: 'Item excluido com sucesso.' });
    } catch (e: any) {
      if (e instanceof ValidationError) {
        return response.status(HttpStatusCodes.BAD_REQUEST).json({ errors: e.errors });
      }

      if (e instanceof PurchaseOrderItemNotDeletedError) {
        return response.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).json({ message: e.message });
      }

      return next(e);
    }
  }

  public async applyVoucher(request: Request, response: Response, next: NextFunction) {
    try {
      const { customerId, voucherCode } = request.body;

      await this.mediator.send(new ApplyVoucherCommand(customerId, voucherCode));

      return response.status(HttpStatusCodes.OK).json({
        message: 'Voucher aplicado com sucesso.',
      });
    } catch (e) {
      if (e instanceof ValidationError) {
        return response.status(HttpStatusCodes.BAD_REQUEST).json({ errors: e.errors });
      }

      if (e instanceof VoucherInvalidError) {
        return response.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).json({ message: e.message });
      }

      if (e instanceof VoucherNotFoundError || e instanceof PurchaseOrderNotFoundError) {
        return response.status(HttpStatusCodes.NOT_FOUND).json({ message: e.message });
      }

      return next(e);
    }
  }

  // eslint-disable-next-line max-len
  public async updatePurchaseOrderItemQuantity(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;
      const { quantity } = request.body;

      await this.mediator.send(
        new UpdatePurchaseOrderItemQuantityCommand(id, quantity),
      );

      return response.status(HttpStatusCodes.NO_CONTENT).json({});
    } catch (e) {
      if (e instanceof PurchaseOrderItemNotFoundError) {
        return response.status(HttpStatusCodes.NOT_FOUND).json({ message: e.message });
      }

      return next(e);
    }
  }

  public async getPurchaseOrder(request: Request, response: Response, next: NextFunction) {
    try {
      const purchaseOrder = await this.mediator.send<PurchaseOrder>(new GetPurchaseOrderQuery(request.params.id));

      return response.status(HttpStatusCodes.OK).json(purchaseOrder!.toObject());
    } catch (e) {
      if (e instanceof PurchaseOrderNotFoundError) {
        return response.status(HttpStatusCodes.NOT_FOUND).json({ message: e.message });
      }

      return next(e);
    }
  }

  public async getPurchaseOrders(request: Request, response: Response, next: NextFunction) {
    try {
      const purchaseOrders = await this.mediator.send<PurchaseOrder[]>(
        new GetPurchaseOrdersQuery(request.params.id),
      );

      return response.status(HttpStatusCodes.OK).json({
        results: purchaseOrders!.map((po) => po.toObject()),
      });
    } catch (e) {
      return next(e);
    }
  }

  public async getPurchaseOrderItem(request: Request, response: Response, next: NextFunction) {
    try {
      const purchaseOrderItem = await this.mediator.send<PurchaseOrderItem>(
        new GetPurchaseOrderItemQuery(request.params.id),
      );

      return response.status(HttpStatusCodes.OK).json(purchaseOrderItem!.toObject());
    } catch (e) {
      if (e instanceof PurchaseOrderItemNotFoundError) {
        return response.status(HttpStatusCodes.NOT_FOUND).json({ message: e.message });
      }

      return next(e);
    }
  }

  public async getVoucher(request: Request, response: Response, next: NextFunction) {
    try {
      const { code } = request.params;

      const voucher = await this.mediator.send<Voucher>(new GetVoucherQuery(Number(code)));

      return response.status(HttpStatusCodes.OK).json(voucher!.toObject());
    } catch (e) {
      if (e instanceof VoucherNotFoundError) {
        return response.status(HttpStatusCodes.NOT_FOUND).json({ message: e.message });
      }
      return next(e);
    }
  }
}
