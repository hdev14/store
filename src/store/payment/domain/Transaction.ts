/* eslint-disable no-shadow */
import Entity from '@shared/abstractions/Entity';

export enum TransactionStatus {
  PAID = 'paid',
  PENDING = 'pending',
  REFUNDED = 'refunded',
  REFUSED = 'refused',
  CHARGED_BACK = 'charged_back',
  CANCELED = 'canceled',
}

export type TransactionProps = {
  id: string;
  transactionId: string;
  status: TransactionStatus;
  details: string;
  payload: string;
  paymentId: string;
  registedAt: Date;
}

export default class Transaction extends Entity {
  public readonly transactionId: string;

  public readonly status: TransactionStatus;

  public readonly details: string;

  public readonly payload: string;

  public readonly paymentId: string;

  public readonly registedAt: Date;

  constructor(props: TransactionProps) {
    super(props.id);
    this.transactionId = props.transactionId;
    this.status = props.status;
    this.details = props.details;
    this.payload = props.payload;
    this.paymentId = props.paymentId;
    this.registedAt = props.registedAt;
  }

  public validate(): boolean | void {
    // TDOO: add validation
    throw new Error('Method not implemented.');
  }
}
