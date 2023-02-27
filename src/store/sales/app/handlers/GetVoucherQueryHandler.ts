import { IPurchaseOrderRepositoryQueries } from '@sales/domain/IPurchaseOrderRepository';
import Voucher from '@sales/domain/Voucher';
import IHandler from '@shared/abstractions/IHandler';
import VoucherNotFoundError from '../VoucherNotFoundError';
import GetVoucherQuery from '../queries/GetVoucherQuery';

export default class GetVoucherQueryHandler implements IHandler<GetVoucherQuery, Voucher> {
  constructor(private readonly repository: IPurchaseOrderRepositoryQueries) { }

  public async handle(event: GetVoucherQuery): Promise<Voucher> {
    const voucher = await this.repository.getVoucherByCode(event.voucherCode);

    if (!voucher) {
      throw new VoucherNotFoundError();
    }

    return voucher;
  }
}
