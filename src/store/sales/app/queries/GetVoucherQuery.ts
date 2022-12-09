import Voucher from '@sales/domain/Voucher';
import Query from '@shared/abstractions/Query';

export type GetVoucherParams = {
  voucherCode: number;
}

// eslint-disable-next-line max-len
export default class GetVoucherQuery extends Query<Voucher, GetVoucherParams> {}
