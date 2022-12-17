/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import Entity from '@shared/abstractions/Entity';

export enum TransactionStatus {
  PAID = 'paid',
  PENDING = 'pending',
  REFUNDED = 'refunded',
  REFUSED = 'refused',
  CHARGED_BACK = 'charged_back',
  CANCELED = 'canceled',
}

export type TransactionParams = {
  id: string;
  transactionId: string;
  status: TransactionStatus;
  details: string;
  payload: string;
  paymentId: string;
  registedAt: Date;
}

export default class Transaction extends Entity {
  public transactionId: string;

  public status: TransactionStatus;

  public details: string;

  public payload: string;

  public paymentId: string;

  public registedAt: Date;

  constructor(params: TransactionParams) {
    super(params.id);
    this.transactionId = params.transactionId;
    this.status = params.status;
    this.details = params.details;
    this.payload = params.payload;
    this.paymentId = params.paymentId;
    this.registedAt = params.registedAt;
  }

  public validate(): boolean | void {
    // TDOO: add validation
    throw new Error('Method not implemented.');
  }
}
