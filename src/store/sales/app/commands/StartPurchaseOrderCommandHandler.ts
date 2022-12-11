import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import IHandler from '@shared/abstractions/IHandler';
import { StartPurchaseOrderData } from './StartPurchaseOrderCommand';

// eslint-disable-next-line max-len
export default class StartPurchaseOrderCommandHandler implements IHandler<boolean, StartPurchaseOrderData> {
  private readonly repository: IPurchaseOrderRepository;

  constructor(repository: IPurchaseOrderRepository) {
    this.repository = repository;
  }

  public async handle(data: StartPurchaseOrderData): Promise<boolean> {
    try {
      const purchaseOrder = await this.repository.getPurchaseOrderById(data.purchaseOrderId);

      if (!purchaseOrder) {
        return false;
      }

      purchaseOrder.start();

      await this.repository.updatePurchaseOrder(purchaseOrder);

      return true;
    } catch (e: any) {
      console.error(e.stack);
      return false;
    }
  }
}
