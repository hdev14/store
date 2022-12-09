export default class PurchaseOrderNotFoundError extends Error {
  constructor() {
    super('Pedido não encontrado.');
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, PurchaseOrderNotFoundError.prototype);
  }
}
