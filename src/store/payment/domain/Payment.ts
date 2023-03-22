/* eslint-disable no-shadow */
import Entity from '@shared/abstractions/Entity';
import IAggregateRoot from '@shared/abstractions/IAggregateRoot';
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
  purchaseOrderId: string;
  value: number;
  method: PaymentMethods;
  status: PaymentStatus;
  gateway: string;
  transactions: TransactionProps[];
};

export default class Payment extends Entity<PaymentProps> implements IAggregateRoot {
  public readonly purchaseOrderId: string;

  public readonly value: number;

  public readonly method: PaymentMethods;

  public readonly status: PaymentStatus;

  public readonly gateway: string;

  public readonly transactions: Transaction[] = [];

  constructor(props: PaymentProps) {
    super(props.id);
    this.purchaseOrderId = props.purchaseOrderId;
    this.value = props.value;
    this.method = props.method;
    this.status = props.status;
    this.gateway = props.gateway;
    for (const transactionProps of props.transactions) {
      this.transactions.push(new Transaction(transactionProps));
    }
  }

  public validate(): boolean | void {
    // TODO: add validation
    throw new Error('Method not implemented.');
  }
}
