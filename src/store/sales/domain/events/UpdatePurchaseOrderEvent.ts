import DomainEvent from '@shared/abstractions/DomainEvent';
import { PurchaseOrderStatus } from '../PurchaseOrder';
import PurchaseOrderItem from '../PurchaseOrderItem';
import Voucher from '../Voucher';

export default class UpdatePurchaseOrderEvent extends DomainEvent {
  constructor(
    readonly principalId: string,
    readonly customerId: string,
    readonly code: number,
    readonly createdAt: Date,
    readonly status: PurchaseOrderStatus,
    readonly totalAmount: number,
    readonly discountAmount: number,
    readonly voucher: Voucher | null,
    readonly items: Array<PurchaseOrderItem>,
  ) {
    super(principalId);
  }
}
