/* eslint-disable no-shadow */
import Entity from '@shared/abstractions/Entity';
import IAggregateRoot from '@shared/abstractions/IAggregateRoot';
import Validator from '@shared/utils/Validator';
import Transaction, { TransactionProps } from './Transaction';

export enum PaymentMethods {
  CREDIT_CARD = 'credit_card',
  BOLETO = 'boleto',
  PIX = 'pix',
}

export enum PaymentStatus {
  APPROVED = 'approved',
  IN_PROCCESS = 'in_proccess',
  REFUSED = 'refused',
  CANCELED = 'canceled'
}

export type PaymentProps = {
  id: string;
  purchase_order_id: string;
  value: number;
  method: PaymentMethods;
  status: PaymentStatus;
  gateway: string;
  transactions: TransactionProps[];
};

export default class Payment extends Entity<PaymentProps> implements IAggregateRoot {
  public readonly purchase_order_id: string;

  public readonly value: number;

  public readonly method: PaymentMethods;

  public readonly status: PaymentStatus;

  public readonly gateway: string;

  public readonly transactions: Transaction[] = [];

  constructor(props: PaymentProps) {
    super(props.id);
    this.purchase_order_id = props.purchase_order_id;
    this.value = props.value;
    this.method = props.method;
    this.status = props.status;
    this.gateway = props.gateway;
    for (const transactionProps of props.transactions) {
      this.transactions.push(new Transaction(transactionProps));
    }
  }

  public validate(): boolean | void {
    Validator.setData(this)
      .setRule('purchase_order_id', ['required', 'string', 'uuid'])
      .setRule('value', ['required', 'number'])
      .setRule('method', ['required', 'string'])
      .setRule('status', ['required', 'string'])
      .setRule('gateway', ['required', 'string'])
      .validate();
  }
}
