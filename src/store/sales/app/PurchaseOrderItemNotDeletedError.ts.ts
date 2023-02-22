export default class PurchaseOrderItemNotDeletedError extends Error {
  constructor() {
    super('Não foi possível excluir o item.');
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, PurchaseOrderItemNotDeletedError.prototype);
  }
}
