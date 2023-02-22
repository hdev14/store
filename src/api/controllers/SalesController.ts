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

      return response.status(201).json({
        message: 'Item adicionado ao pedido.',
      });
    } catch (e) {
      if (e instanceof ValidationError) {
        return response.status(400).send({ errors: e.errors });
      }

      return next(e);
    }
  }

  public async removePurchaseOrderItem(request: Request, response: Response, next: NextFunction) {
    try {
      await this.mediator.send(
        new RemovePurchaseOrderItemCommand(request.params.id),
      );

      return response.status(200).json({ message: 'Item excluido com sucesso.' });
    } catch (e: any) {
      if (e instanceof ValidationError) {
        return response.status(400).json({ errors: e.errors });
      }

      if (e instanceof PurchaseOrderItemNotDeletedError) {
        return response.status(422).json({ message: e.message });
      }

      return next(e);
    }
  }

  public async applyVoucher(request: Request, response: Response, next: NextFunction) {
    try {
      const { customerId, voucherCode } = request.body;

      await this.mediator.send(new ApplyVoucherCommand(customerId, voucherCode));

      return response.status(200).json({
        message: 'Voucher aplicado com sucesso.',
      });
    } catch (e) {
      if (e instanceof ValidationError) {
        return response.status(400).json({ errors: e.errors });
      }

      if (e instanceof VoucherInvalidError) {
        return response.status(422).json({ message: e.message });
      }

      if (e instanceof VoucherNotFoundError || e instanceof PurchaseOrderNotFoundError) {
        return response.status(404).json({ message: e.message });
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

      return response.status(204).json({});
    } catch (e) {
      if (e instanceof PurchaseOrderItemNotFoundError) {
        return response.status(404).json({ message: e.message });
      }

      return next(e);
    }
  }

  public async getPurchaseOrder(request: Request, response: Response, next: NextFunction) {
    try {
      const purchaseOrder = await this.mediator.send(new GetPurchaseOrderQuery(request.params.id));

      return response.status(200).json(purchaseOrder);
    } catch (e) {
      if (e instanceof PurchaseOrderNotFoundError) {
        return response.status(404).json({ message: e.message });
      }

      return next(e);
    }
  }

  public async getPurchaseOrders(request: Request, response: Response, next: NextFunction) {
    try {
      const purchaseOrders = await this.mediator.send(
        new GetPurchaseOrdersQuery(request.params.id),
      );

      return response.status(200).json(purchaseOrders);
    } catch (e) {
      return next(e);
    }
  }

  public async getPurchaseOrderItem(request: Request, response: Response, next: NextFunction) {
    try {
      const purchaseOrderItem = await this.mediator.send(
        new GetPurchaseOrderItemQuery(request.params.id),
      );

      return response.status(200).json(purchaseOrderItem);
    } catch (e) {
      if (e instanceof PurchaseOrderItemNotFoundError) {
        return response.status(404).json({ message: e.message });
      }

      return next(e);
    }
  }

  public async getVoucher(request: Request, response: Response, next: NextFunction) {
    try {
      const { code } = request.params;

      const voucher = await this.mediator.send(new GetVoucherQuery(Number(code)));

      return response.status(200).json(voucher);
    } catch (e) {
      if (e instanceof VoucherNotFoundError) {
        return response.status(404).json({ message: e.message });
      }
      return next(e);
    }
  }
}
