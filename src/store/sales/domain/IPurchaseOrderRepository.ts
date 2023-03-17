/* eslint-disable max-len */
import PurchaseOrder from './PurchaseOrder';
import PurchaseOrderItem from './PurchaseOrderItem';
import Voucher from './Voucher';

export interface IPurchaseOrderRepositoryQueries {
  /** @throws {RepositoryError} */
  getPurchaseOrderById(id: string): Promise<PurchaseOrder | null>;

  /** @throws {RepositoryError} */
  getPurchaseOrdersByCustomerId(id: string): Promise<PurchaseOrder[]>;

  /** @throws {RepositoryError} */
  getDraftPurchaseOrderByCustomerId(id: string): Promise<PurchaseOrder | null>;

  /** @throws {RepositoryError} */
  getPurchaseOrderItemById(id: string): Promise<PurchaseOrderItem | null>;

  /** @throws {RepositoryError} */
  getPurchaseOrderItem(params: { purchaseOrderId: string, productId: string }): Promise<PurchaseOrderItem | null>;

  /** @throws {RepositoryError} */
  getVoucherByCode(code: number): Promise<Voucher | null>;
}

export interface IPurchaseOrderRepositoryCommands {
  /** @throws {RepositoryError} */
  addPurchaseOrder(purchaseOrder: PurchaseOrder): Promise<void>;

  /** @throws {RepositoryError} */
  updatePurchaseOrder(purchaseOrder: PurchaseOrder): Promise<void>;

  /** @throws {RepositoryError} */
  addPurchaseOrderItem(purchaseOrderItem: PurchaseOrderItem): Promise<void>;

  /** @throws {RepositoryError} */
  updatePurchaseOrderItem(purchaseOrderItem: PurchaseOrderItem): Promise<void>;

  /** @throws {RepositoryError} */
  deletePurchaseOrderItem(purchaseOrderItemId: string): Promise<void>;
}

interface IPurchaseOrderRepository extends IPurchaseOrderRepositoryQueries, IPurchaseOrderRepositoryCommands {
  /** @throws {RepositoryError} */
  countPurchaseOrders(): Promise<number>;

  /** @throws {RepositoryError} */
  countPurchaseOrderItems(): Promise<number>;

  /** @throws {RepositoryError} */
  countVouchers(): Promise<number>;
}

export default IPurchaseOrderRepository;
