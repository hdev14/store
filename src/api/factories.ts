import CategoryService from '@catalog/app/CategoryService';
import LowStockProductEventHandler from '@catalog/app/LowStockProductEventHandler';
import ProductService from '@catalog/app/ProductService';
import LowStockProductEvent from '@catalog/domain/LowStockProductEvent';
import StockService from '@catalog/domain/StockService';
import NodemailerEmailService from '@catalog/infra/notification/NodemailerEmailService';
import PrismaProductRepository from '@catalog/infra/persistence/PrismaProductRepository';
import AddPurchaseOrderItemCommand from '@sales/app/AddPurchaseOrderItemCommand';
import AddPurchaseOrderItemCommandHandler from '@sales/app/AddPurchaseOrderItemCommandHandler';
import PrismaPurchaseOrderRepository from '@sales/infra/persistence/PrismaPurchaseOrderRepository';
import StoreMediator from '@shared/StoreMediator';
import generateUUID from '@shared/utils/generateUUID';
import CatalogController from './controllers/CatalogController';
import SalesController from './controllers/SalesController';

export const storeMediator = new StoreMediator();

export function createSalesController() {
  const purchaseOrderRepository = new PrismaPurchaseOrderRepository();
  const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(
    purchaseOrderRepository,
    generateUUID,
  );
  storeMediator.addEvent(AddPurchaseOrderItemCommand.name, addPurchaseOrderItemCommandHandler);
  const addPurchaseOrderItemCommand = new AddPurchaseOrderItemCommand(storeMediator);
  return new SalesController(addPurchaseOrderItemCommand, generateUUID);
}

export function createCatalogController() {
  const emailServcie = new NodemailerEmailService();
  const lowStockProductEventHandler = new LowStockProductEventHandler(emailServcie);
  storeMediator.addEvent(LowStockProductEvent.name, lowStockProductEventHandler);
  const lowProductStockEvent = new LowStockProductEvent(storeMediator);
  const productRepository = new PrismaProductRepository();
  const stockService = new StockService(productRepository, lowProductStockEvent);
  const productService = new ProductService(productRepository, generateUUID, stockService);
  const categoryService = new CategoryService(productRepository, generateUUID);
  return new CatalogController(productService, categoryService);
}
