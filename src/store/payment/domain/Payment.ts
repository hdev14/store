/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import Entity from '@shared/abstractions/Entity';
import IAggregateRoot from '@shared/abstractions/IAggregateRoot';
import Transaction from './Transaction';

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

export type PaymentParams = {
  id: string;
  purchaseOrderId: string;
  value: number;
  method: PaymentMethods;
  status: PaymentStatus;
  gateway: string;
  transactions: Transaction[];
};

export default class Payment extends Entity implements IAggregateRoot {
  public purchaseOrderId: string;

  public value: number;

  public method: PaymentMethods;

  public status: PaymentStatus;

  public gateway: string;

  public transactions: Transaction[];

  constructor(params: PaymentParams) {
    super(params.id);
    this.purchaseOrderId = params.purchaseOrderId;
    this.value = params.value;
    this.method = params.method;
    this.status = params.status;
    this.gateway = params.gateway;
    this.transactions = params.transactions;
  }

  public validate(): boolean | void {
    // TODO: add validation
    throw new Error('Method not implemented.');
  }
}
