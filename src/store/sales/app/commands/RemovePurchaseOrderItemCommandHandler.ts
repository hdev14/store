import { IPurchaseOrderRepositoryCommands } from '@sales/domain/IPurchaseOrderRepository';
import IHandler from '@shared/abstractions/IHandler';
import { RemovePurchaseOrderItemCommandData } from './RemovePurchaseOrderItemCommand';

// eslint-disable-next-line max-len
export default class RemovePurchaseOrderItemCommandHandler implements IHandler<boolean, RemovePurchaseOrderItemCommandData> {
  private readonly repository: IPurchaseOrderRepositoryCommands;

  constructor(repository: IPurchaseOrderRepositoryCommands) {
    this.repository = repository;
  }

  public async handle(data: RemovePurchaseOrderItemCommandData): Promise<boolean> {
    try {
      const isDeleted = await this.repository.deletePurchaseOrderItem(data.purchaseOrderItemId);
      // TODO: add event
      return isDeleted;
    } catch (e: any) {
      console.error(e.stack);
      return false;
    }
  }
}
