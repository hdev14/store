import { IPurchaseOrderRepositoryQueries } from '@sales/domain/IPurchaseOrderRepository';
import { VoucherProps } from '@sales/domain/Voucher';
import IHandler from '@shared/abstractions/IHandler';
import VoucherNotFoundError from '../VoucherNotFoundError';
import GetVoucherQuery from '../queries/GetVoucherQuery';

export default class GetVoucherQueryHandler implements IHandler<GetVoucherQuery, VoucherProps> {
  constructor(private readonly repository: IPurchaseOrderRepositoryQueries) { }

  public async handle(event: GetVoucherQuery): Promise<VoucherProps> {
    const voucher = await this.repository.getVoucherByCode(event.voucherCode);

    if (!voucher) {
      throw new VoucherNotFoundError();
    }

    return voucher.toObject();
  }
}
