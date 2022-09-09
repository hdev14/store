import { AddPurchaseOrderItemData } from '@sales/app/AddPurchaseOrderItemCommand';
import Command from '@shared/abstractions/Command';
import { NextFunction, Request, Response } from 'express';

export default class SalesController {
  private addPurchaseOrderItemCommand: Command<boolean, AddPurchaseOrderItemData>;

  constructor(addPurchaseOrderItemCommand: Command<boolean, AddPurchaseOrderItemData>) {
    this.addPurchaseOrderItemCommand = addPurchaseOrderItemCommand;
  }

  public async addPurchaseOrderItem(request: Request, response: Response, next: NextFunction) {
    try {
      return response.sendStatus(200);
    } catch (e) {
      return next(e);
    }
  }
}
