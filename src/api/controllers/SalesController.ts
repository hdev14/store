import { AddPurchaseOrderItemData } from '@sales/app/AddPurchaseOrderItemCommand';
import Command from '@shared/abstractions/Command';

export default class SalesController {
  private addPurchaseOrderItemCommand: Command<boolean, AddPurchaseOrderItemData>;

  constructor(addPurchaseOrderItemCommand: Command<boolean, AddPurchaseOrderItemData>) {
    this.addPurchaseOrderItemCommand = addPurchaseOrderItemCommand;
  }
}
