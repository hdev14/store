import PurchaseOrder from '@sales/domain/PurchaseOrder';
import IHandler from '@shared/abstractions/IHandler';
import { Results } from '@shared/abstractions/Query';
import { IPurchaseOrderRepositoryQueries } from '@sales/domain/IPurchaseOrderRepository';
import { GetPurchaseOrderParams } from './GetPurchaseOrderQuery';
// eslint-disable-next-line max-len
export default class GetPurchaseOrderQueryHandler implements IHandler<Results<PurchaseOrder>, GetPurchaseOrderParams> {
  private readonly repository;

  constructor(repository: IPurchaseOrderRepositoryQueries) {
    this.repository = repository;
  }

  public async handle(params: GetPurchaseOrderParams): Promise<Results<PurchaseOrder>> {
    const purchaseOrder = await this.repository.getPurchaseOrderById(params.purchaseOrderId);

    return {
      results: [],
    };
  }
}
