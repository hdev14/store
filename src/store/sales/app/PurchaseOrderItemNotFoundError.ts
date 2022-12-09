export default class PurchaseOrderItemNotFoundError extends Error {
  constructor() {
    super('Item não encontrado.');
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, PurchaseOrderItemNotFoundError.prototype);
  }
}
