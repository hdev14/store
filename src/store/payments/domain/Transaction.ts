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
  external_id: string;
  status: TransactionStatus;
  details: string;
  payload: string;
  payment_id: string;
  registered_at: Date;
}

export default class Transaction extends Entity {
  public readonly external_id: string;

  public readonly status: TransactionStatus;

  public readonly details: string;

  public readonly payload: string; // JSON

  public readonly payment_id: string;

  public readonly registered_at: Date;

  constructor(props: TransactionProps) {
    super(props.id);
    this.external_id = props.external_id;
    this.status = props.status;
    this.details = props.details;
    this.payload = props.payload;
    this.payment_id = props.payment_id;
    this.registered_at = props.registered_at;
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
