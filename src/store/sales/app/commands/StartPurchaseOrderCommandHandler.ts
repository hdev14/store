import IHandler from '@shared/abstractions/IHandler';
import { StartPurchaseOrderData } from './StartPurchaseOrderCommand';

// eslint-disable-next-line max-len
export default class StartPurchaseOrderCommandHandler implements IHandler<boolean, StartPurchaseOrderData> {
  public async handle(_data: StartPurchaseOrderData): Promise<boolean> {
    // get purchase order
    // update status to started
    throw new Error('Method not implemented.');
  }
}
