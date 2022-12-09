import Voucher from '@sales/domain/Voucher';
import IHandler from '@shared/abstractions/IHandler';
import { Results } from '@shared/abstractions/Query';
import { GetVoucherParams } from './GetVoucherQuery';

// eslint-disable-next-line max-len
export default class GetVoucherQueryHandler implements IHandler<Results<Voucher>, GetVoucherParams> {
  public async handle(_params: GetVoucherParams): Promise<Results<Voucher>> {
    throw new Error('Method not implemented.');
  }
}
