import { PurchaseOrderProps } from '@sales/domain/PurchaseOrder';
import IHandler from '@shared/abstractions/IHandler';
import { IPurchaseOrderRepositoryQueries } from '@sales/domain/IPurchaseOrderRepository';
import GetPurchaseOrderQuery from '../queries/GetPurchaseOrderQuery';
import PurchaseOrderNotFoundError from '../PurchaseOrderNotFoundError';

// TODO: change return
// eslint-disable-next-line max-len
export default class GetPurchaseOrderQueryHandler implements IHandler<GetPurchaseOrderQuery, PurchaseOrderProps> {
  constructor(private readonly repository: IPurchaseOrderRepositoryQueries) { }

  public async handle(event: GetPurchaseOrderQuery): Promise<PurchaseOrderProps> {
    const purchaseOrder = await this.repository.getPurchaseOrderById(event.purchaseOrderId);

    if (!purchaseOrder) {
      throw new PurchaseOrderNotFoundError();
    }

    return purchaseOrder.toObject();
  }
}
