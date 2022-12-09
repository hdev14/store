import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import Query from '@shared/abstractions/Query';

export type GetVoucherParams = {
  voucherCode: number;
}

// eslint-disable-next-line max-len
export default class GetVoucherQuery extends Query<PurchaseOrderItem, GetVoucherParams> {}
