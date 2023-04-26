/* eslint-disable no-shadow */
import Entity from '@shared/abstractions/Entity';
import Validator from '@shared/utils/Validator';

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
  externalId: string;
  status: TransactionStatus;
  details: string;
  payload: string;
  paymentId: string;
  registeredAt: Date;
}

export default class Transaction extends Entity {
  public readonly externalId: string;

  public readonly status: TransactionStatus;

  public readonly details: string;

  public readonly payload: string; // JSON

  public readonly paymentId: string;

  public readonly registeredAt: Date;

  constructor(props: TransactionProps) {
    super(props.id);
    this.externalId = props.externalId;
    this.status = props.status;
    this.details = props.details;
    this.payload = props.payload;
    this.paymentId = props.paymentId;
    this.registeredAt = props.registeredAt;
  }

  public validate(): boolean | void {
    Validator
      .setData(this)
      .setRule('externalId', ['required', 'string', 'uuid'])
      .setRule('status', ['required', 'string'])
      .setRule('details', ['required', 'string'])
      .setRule('paymentId', ['required', 'string'])
      .setRule('registeredAt', ['required', 'date'])
      .validate();
  }
}
