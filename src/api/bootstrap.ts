/* eslint-disable max-len */
import CategoryService from '@catalog/app/CategoryService';
import LowStockProductEventHandler from '@catalog/app/LowStockProductEventHandler';
import ProductService from '@catalog/app/ProductService';
import LowStockProductEvent from '@catalog/domain/LowStockProductEvent';
import StockService from '@catalog/domain/StockService';
import NodemailerEmailService from '@catalog/infra/notification/NodemailerEmailService';
import PrismaProductRepository from '@catalog/infra/persistence/PrismaProductRepository';
import AddPurchaseOrderItemCommand from '@sales/app/commands/AddPurchaseOrderItemCommand';
import AddPurchaseOrderItemCommandHandler from '@sales/app/handlers/AddPurchaseOrderItemCommandHandler';
import ApplyVoucherCommand from '@sales/app/commands/ApplyVoucherCommand';
import RemovePurchaseOrderItemCommand from '@sales/app/commands/RemovePurchaseOrderItemCommand';
import UpdatePurchaseOrderItemQuantityCommand from '@sales/app/commands/UpdatePurchaseOrderItemQuantityCommand';
import GetPurchaseOrderItemQuery from '@sales/app/queries/GetPurchaseOrderItemQuery';
import GetPurchaseOrderQuery from '@sales/app/queries/GetPurchaseOrderQuery';
import GetPurchaseOrdersQuery from '@sales/app/queries/GetPurchaseOrdersQuery';
import GetVoucherQuery from '@sales/app/queries/GetVoucherQuery';
import PrismaPurchaseOrderRepository from '@sales/infra/persistence/PrismaPurchaseOrderRepository';
import Mediator from '@shared/Mediator';
import ApplyVoucherCommandHandler from '@sales/app/handlers/ApplyVoucherCommandHandler';
import GetPurchaseOrderItemQueryHandler from '@sales/app/handlers/GetPurchaseOrderItemQueryHandler';
import GetPurchaseOrderQueryHandler from '@sales/app/handlers/GetPurchaseOrderQueryHandler';
import GetPurchaseOrdersQueryHandler from '@sales/app/handlers/GetPurchaseOrdersQueryHandler';
import GetVoucherQueryHandler from '@sales/app/handlers/GetVoucherQueryHandler';
import RemovePurchaseOrderItemCommandHandler from '@sales/app/handlers/RemovePurchaseOrderItemCommandHandler';
import UpdatePurchaseOrderItemQuantityCommandHandler from '@sales/app/handlers/UpdatePurchaseOrderItemQuantityCommandHandler';
import BullmqEventQueue from '@shared/BullmqEventQueue';
import SalesController from './controllers/SalesController';
import CatalogController from './controllers/CatalogController';

// Utils
const mediator = new Mediator();
const emailService = new NodemailerEmailService();
const eventQueue = new BullmqEventQueue();

// Repositories
const productRepository = new PrismaProductRepository();
const prismaPurchaseOrderRepository = new PrismaPurchaseOrderRepository();

// Events
const lowStockProductEventHandler = new LowStockProductEventHandler(emailService);
mediator.register(LowStockProductEvent.name, lowStockProductEventHandler);

// Services
const stockService = new StockService(productRepository, mediator);
const productService = new ProductService(productRepository, stockService);
const categoryService = new CategoryService(productRepository);

// Command Handlers
const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(prismaPurchaseOrderRepository, eventQueue);
const removePurchaseOrderItemCommandHandler = new RemovePurchaseOrderItemCommandHandler(prismaPurchaseOrderRepository, eventQueue);
const applyVoucherCommandHandler = new ApplyVoucherCommandHandler(prismaPurchaseOrderRepository);
const updatePurchaseOrderItemQuantityCommandHandler = new UpdatePurchaseOrderItemQuantityCommandHandler(prismaPurchaseOrderRepository, eventQueue);

mediator.register(AddPurchaseOrderItemCommand.name, addPurchaseOrderItemCommandHandler);
mediator.register(RemovePurchaseOrderItemCommand.name, removePurchaseOrderItemCommandHandler);
mediator.register(ApplyVoucherCommand.name, applyVoucherCommandHandler);
mediator.register(UpdatePurchaseOrderItemQuantityCommand.name, updatePurchaseOrderItemQuantityCommandHandler);

// Query Handlers
const getPurchaseOrderQueryHandler = new GetPurchaseOrderQueryHandler(prismaPurchaseOrderRepository);
const getPurchaseOrdersQueryHandler = new GetPurchaseOrdersQueryHandler(prismaPurchaseOrderRepository);
const getPurchaseOrderItemQueryHandler = new GetPurchaseOrderItemQueryHandler(prismaPurchaseOrderRepository);
const getVoucherQueryHandler = new GetVoucherQueryHandler(prismaPurchaseOrderRepository);

mediator.register(GetPurchaseOrderQuery.name, getPurchaseOrderQueryHandler);
mediator.register(GetPurchaseOrdersQuery.name, getPurchaseOrdersQueryHandler);
mediator.register(GetPurchaseOrderItemQuery.name, getPurchaseOrderItemQueryHandler);
mediator.register(GetVoucherQuery.name, getVoucherQueryHandler);

// Controllers
const catalogController = new CatalogController(productService, categoryService);
const salesController = new SalesController(mediator);

export default {
  controllers: {
    salesController,
    catalogController,
  },
};
