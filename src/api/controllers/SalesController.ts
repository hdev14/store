import { AddPurchaseOrderItemData } from '@sales/app/commands/AddPurchaseOrderItemCommand';
import Command from '@shared/abstractions/Command';
import IGenerateID from '@shared/utils/IGenerateID';
import { NextFunction, Request, Response } from 'express';
import ValidationError from '@shared/errors/ValidationError';
import { ApplyVoucherCommandData } from '@sales/app/commands/ApplyVoucherCommand';
import { UpdatePurchaseOrderItemQuantityCommandData } from '@sales/app/commands/UpdatePurchaseOrderItemQuantityCommand';
import Query from '@shared/abstractions/Query';

export default class SalesController {
  private addPurchaseOrderItemCommand: Command<boolean, AddPurchaseOrderItemData>;

  private generateID: IGenerateID;

  private removePurchaseOrderItemCommand: Command<boolean, {}>;

  private applyVoucherCommand: Command<boolean, ApplyVoucherCommandData>;

  // eslint-disable-next-line max-len
  private updatePurchaseOrderItemQuantityCommand: Command<boolean, UpdatePurchaseOrderItemQuantityCommandData>;

  private getPurchaseOrderQuery: Query<{}>;

  private getPurchaseOrderItemQuery: any;

  constructor(
    addPurchaseOrderItemCommand: Command<boolean, AddPurchaseOrderItemData>,
    removePurchaseOrderItemCommand: Command<boolean, {}>,
    applyVoucherCommand: Command<boolean, ApplyVoucherCommandData>,
    // eslint-disable-next-line max-len
    updatePurchaseOrderItemQuantityCommand: Command<boolean, UpdatePurchaseOrderItemQuantityCommandData>,
    getPurchaseOrderQuery: Query<{}>,
    getPurchaseOrderItemQuery: Query<{}>,
    generateID: IGenerateID,
  ) {
    this.addPurchaseOrderItemCommand = addPurchaseOrderItemCommand;
    this.removePurchaseOrderItemCommand = removePurchaseOrderItemCommand;
    this.applyVoucherCommand = applyVoucherCommand;
    this.updatePurchaseOrderItemQuantityCommand = updatePurchaseOrderItemQuantityCommand;
    this.getPurchaseOrderQuery = getPurchaseOrderQuery;
    this.getPurchaseOrderItemQuery = getPurchaseOrderItemQuery;
    this.generateID = generateID;
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

      const result = await this.addPurchaseOrderItemCommand.send({
        principalId: this.generateID(),
        customerId,
        productId,
        productName,
        productAmount,
        quantity,
        timestamp: new Date().toISOString(),
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
      const result = await this.removePurchaseOrderItemCommand.send({
        principalId: request.params.id,
        timestamp: new Date().toISOString(),
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
      const purchaseOrderId = request.params.id;
      const { customerId, voucherCode } = request.body;

      await this.applyVoucherCommand.send({
        principalId: purchaseOrderId,
        customerId,
        voucherCode,
        timestamp: new Date().toISOString(),
      });

      return response.status(200).json({
        message: 'Voucher aplicado com sucesso.',
      });
    } catch (e) {
      return next(e);
    }
  }

  // eslint-disable-next-line max-len
  public async updatePurchaseOrderItemQuantity(request: Request, response: Response, next: NextFunction) {
    try {
      return response.status(200);
    } catch (e) {
      return next(e);
    }
  }

  public async getPurchaseOrder(request: Request, response: Response, next: NextFunction) {
    try {
      return response.status(200);
    } catch (e) {
      return next(e);
    }
  }

  public async getPurchaseOrderItem(request: Request, response: Response, next: NextFunction) {
    try {
      return response.status(200);
    } catch (e) {
      return next(e);
    }
  }
}
