import Command from '@shared/abstractions/Command';

export type StartPurchaseOrderData = {
  purchaseOrderId: string;
};

export default class StartPurchaseOrderCommand extends Command<boolean, StartPurchaseOrderData> {
  public validate(_data: StartPurchaseOrderData): void {
    throw new Error('Method not implemented.');
  }
}
