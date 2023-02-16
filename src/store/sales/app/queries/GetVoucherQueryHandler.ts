import { IPurchaseOrderRepositoryQueries } from '@sales/domain/IPurchaseOrderRepository';
import Voucher from '@sales/domain/Voucher';
import IHandler from '@shared/abstractions/IHandler';
import { Results } from '@shared/abstractions/Query';
import VoucherNotFoundError from '../VoucherNotFoundError';
import { GetVoucherParams } from './GetVoucherQuery';

// eslint-disable-next-line max-len
export default class GetVoucherQueryHandler implements IHandler<Results<Voucher>, GetVoucherParams> {
  constructor(private readonly repository: IPurchaseOrderRepositoryQueries) { }

  public async handle(params: GetVoucherParams): Promise<Results<Voucher>> {
    const voucher = await this.repository.getVoucherByCode(params.voucherCode);

    if (!voucher) {
      throw new VoucherNotFoundError();
    }

    return { results: [voucher] };
  }
}
