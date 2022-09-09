import { AddPurchaseOrderItemData } from '@sales/app/AddPurchaseOrderItemCommand';
import Command from '@shared/abstractions/Command';
import IGenerateID from '@shared/utils/IGenerateID';
import { NextFunction, Request, Response } from 'express';
import ValidationError from '@shared/errors/ValidationError';

export default class SalesController {
  private addPurchaseOrderItemCommand: Command<boolean, AddPurchaseOrderItemData>;

  private generateID: IGenerateID;

  constructor(
    addPurchaseOrderItemCommand: Command<boolean, AddPurchaseOrderItemData>,
    generateID: IGenerateID,
  ) {
    this.addPurchaseOrderItemCommand = addPurchaseOrderItemCommand;
    this.generateID = generateID;
  }

  public async addPurchaseOrderItem(request: Request, response: Response, next: NextFunction) {
    try {
      const {
        clientId,
        productId,
        productName,
        productAmount,
        quantity,
      } = request.body;

      const result = await this.addPurchaseOrderItemCommand.send({
        principalId: this.generateID(),
        clientId,
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

      return response.sendStatus(200);
    } catch (e) {
      if (e instanceof ValidationError) {
        return response.status(400).send({ errors: e.errors });
      }

      return next(e);
    }
  }
}
