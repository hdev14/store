import { NextFunction, Request, Response } from 'express';
import { AddPurchaseOrderItemCommandData } from '@sales/app/commands/AddPurchaseOrderItemCommand';
import Command from '@shared/abstractions/Command';
import ValidationError from '@shared/errors/ValidationError';
import { ApplyVoucherCommandData } from '@sales/app/commands/ApplyVoucherCommand';
import { UpdatePurchaseOrderItemQuantityCommandData } from '@sales/app/commands/UpdatePurchaseOrderItemQuantityCommand';
import Query from '@shared/abstractions/Query';
import { RemovePurchaseOrderItemCommandData } from '@sales/app/commands/RemovePurchaseOrderItemCommand';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import { GetPurchaseOrderParams } from '@sales/app/queries/GetPurchaseOrderQuery';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import { GetPurchaseOrderItemParams } from '@sales/app/queries/GetPurchaseOrderItemQuery';
import { GetPurchaseOrdersParams } from '@sales/app/queries/GetPurchaseOrdersQuery';
import Voucher from '@sales/domain/Voucher';
import { GetVoucherParams } from '@sales/app/queries/GetVoucherQuery';
import PurchaseOrderNotFoundError from '@sales/app/PurchaseOrderNotFoundError';

export default class SalesController {
  private readonly addPurchaseOrderItemCommand: Command<boolean, AddPurchaseOrderItemCommandData>;

  private readonly removePurchaseOrderItemCommand: Command<boolean, {}>;

  private readonly applyVoucherCommand: Command<boolean, ApplyVoucherCommandData>;

  // eslint-disable-next-line max-len
  private readonly updatePurchaseOrderItemQuantityCommand: Command<boolean, UpdatePurchaseOrderItemQuantityCommandData>;

  private readonly getPurchaseOrderQuery: Query<PurchaseOrder, GetPurchaseOrderParams>;

  private readonly getPurchaseOrdersQuery: Query<PurchaseOrder, GetPurchaseOrdersParams>;

  private readonly getPurchaseOrderItemQuery: Query<PurchaseOrderItem, GetPurchaseOrderItemParams>;

  private readonly getVoucherQuery: Query<Voucher, GetVoucherParams>;

  constructor(
    addPurchaseOrderItemCommand: Command<boolean, AddPurchaseOrderItemCommandData>,
    removePurchaseOrderItemCommand: Command<boolean, RemovePurchaseOrderItemCommandData>,
    applyVoucherCommand: Command<boolean, ApplyVoucherCommandData>,
    // eslint-disable-next-line max-len
    updatePurchaseOrderItemQuantityCommand: Command<boolean, UpdatePurchaseOrderItemQuantityCommandData>,
    getPurchaseOrderQuery: Query<PurchaseOrder, GetPurchaseOrderParams>,
    getPurchaseOrdersQuery: Query<PurchaseOrder, GetPurchaseOrdersParams>,
    getPurchaseOrderItemQuery: Query<PurchaseOrderItem, GetPurchaseOrderItemParams>,
    getVoucherQuery: Query<Voucher, GetVoucherParams>,
  ) {
    this.addPurchaseOrderItemCommand = addPurchaseOrderItemCommand;
    this.removePurchaseOrderItemCommand = removePurchaseOrderItemCommand;
    this.applyVoucherCommand = applyVoucherCommand;
    this.updatePurchaseOrderItemQuantityCommand = updatePurchaseOrderItemQuantityCommand;
    this.getPurchaseOrderQuery = getPurchaseOrderQuery;
    this.getPurchaseOrdersQuery = getPurchaseOrdersQuery;
    this.getPurchaseOrderItemQuery = getPurchaseOrderItemQuery;
    this.getVoucherQuery = getVoucherQuery;
  }

  public async addPurchaseOrderItem(request: Request, response: Response, next: NextFunction) {
    try {
      const {
        customerId,
        productId,
        productName,
        productAmount,
        quantity,
      } = request.body;

      const result = await this.addPurchaseOrderItemCommand.execute({
        customerId,
        productId,
        productName,
        productAmount,
        quantity,
      });

      if (result) {
        return response.status(201).json({
          message: 'Item adicionado ao pedido.',
        });
      }

      return response.status(422).json({
        message: 'Não foi possível adicionar o item ao pedido.',
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
      const result = await this.removePurchaseOrderItemCommand.execute({
        purchaseOrderItemId: request.params.id,
      });

      if (!result) {
        return response.status(422).json({
          message: 'Não foi possível excluir o item.',
        });
      }

      return response.status(200).json({ message: 'Item excluido com sucesso.' });
    } catch (e) {
      if (e instanceof ValidationError) {
        return response.status(400).json({ errors: e.errors });
      }

      return next(e);
    }
  }

  public async applyVoucher(request: Request, response: Response, next: NextFunction) {
    try {
      const { customerId, voucherCode } = request.body;

      const result = await this.applyVoucherCommand.execute({
        customerId,
        voucherCode,
      });

      if (!result) {
        return response.status(422).json({
          message: 'Não foi possível utilizar este voucher.',
        });
      }

      return response.status(200).json({
        message: 'Voucher aplicado com sucesso.',
      });
    } catch (e) {
      if (e instanceof ValidationError) {
        return response.status(400).json({ errors: e.errors });
      }

      return next(e);
    }
  }

  // eslint-disable-next-line max-len
  public async updatePurchaseOrderItemQuantity(request: Request, response: Response, next: NextFunction) {
    try {
      return response.status(200).json({});
    } catch (e) {
      return next(e);
    }
  }

  public async getPurchaseOrder(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;

      const data = await this.getPurchaseOrderQuery.execute({
        purchaseOrderId: id,
      });

      return response.status(200).json(data.results[0]);
    } catch (e) {
      if (e instanceof PurchaseOrderNotFoundError) {
        return response.status(404).json({ message: e.message });
      }

      return next(e);
    }
  }

  public async getPurchaseOrders(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;

      const result = await this.getPurchaseOrdersQuery.execute({
        customerId: id,
      });

      return response.status(200).json(result);
    } catch (e) {
      return next(e);
    }
  }

  public async getPurchaseOrderItem(request: Request, response: Response, next: NextFunction) {
    try {
      return response.status(200).json({});
    } catch (e) {
      return next(e);
    }
  }

  public async getVoucher(request: Request, response: Response, next: NextFunction) {
    try {
      return response.status(200).json({});
    } catch (e) {
      return next(e);
    }
  }
}
