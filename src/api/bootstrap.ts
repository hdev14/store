/* eslint-disable max-len */
import CategoryService from '@catalog/app/CategoryService';
import LowStockProductEventHandler from '@catalog/app/LowStockProductEventHandler';
import ProductService from '@catalog/app/ProductService';
import LowStockProductEvent from '@catalog/domain/LowStockProductEvent';
import StockService from '@catalog/domain/StockService';
import NodemailerEmailService from '@catalog/infra/notification/NodemailerEmailService';
import PrismaProductRepository from '@catalog/infra/persistence/PrismaProductRepository';
import AddPurchaseOrderItemCommand from '@sales/app/commands/AddPurchaseOrderItemCommand';
import AddPurchaseOrderItemCommandHandler from '@sales/app/commands/AddPurchaseOrderItemCommandHandler';
import ApplyVoucherCommand from '@sales/app/commands/ApplyVoucherCommand';
import ApplyVoucherCommandHandler from '@sales/app/commands/ApplyVoucherCommandHandler';
import RemovePurchaseOrderItemCommand from '@sales/app/commands/RemovePurchaseOrderItemCommand';
import RemovePurchaseOrderItemCommandHandler from '@sales/app/commands/RemovePurchaseOrderItemCommandHandler';
import UpdatePurchaseOrderItemQuantityCommand from '@sales/app/commands/UpdatePurchaseOrderItemQuantityCommand';
import UpdatePurchaseOrderItemQuantityCommandHandler from '@sales/app/commands/UpdatePurchaseOrderItemQuantityCommandHandler';
import GetPurchaseOrderItemQuery from '@sales/app/queries/GetPurchaseOrderItemQuery';
import GetPurchaseOrderItemQueryHandler from '@sales/app/queries/GetPurchaseOrderItemQueryHandler';
import GetPurchaseOrderQuery from '@sales/app/queries/GetPurchaseOrderQuery';
import GetPurchaseOrderQueryHandler from '@sales/app/queries/GetPurchaseOrderQueryHandler';
import GetPurchaseOrdersQuery from '@sales/app/queries/GetPurchaseOrdersQuery';
import GetPurchaseOrdersQueryHandler from '@sales/app/queries/GetPurchaseOrdersQueryHandler';
import GetVoucherQuery from '@sales/app/queries/GetVoucherQuery';
import GetVoucherQueryHandler from '@sales/app/queries/GetVoucherQueryHandler';
import PrismaPurchaseOrderRepository from '@sales/infra/persistence/PrismaPurchaseOrderRepository';
import Mediator from '@shared/Mediator';
import CatalogController from './controllers/CatalogController';
import SalesController from './controllers/SalesController';

// Utils
const mediator = new Mediator();
const emailService = new NodemailerEmailService();

// Repositories
const productRepository = new PrismaProductRepository();
const prismaPurchaseOrderRepository = new PrismaPurchaseOrderRepository();
// const mongoPurchaseOrderRepository = new MongoPurchaseOrderRepository();

// Events
const lowStockProductEventHandler = new LowStockProductEventHandler(emailService);

// Event Handlers
// const addDraftPurchaseOrderEventHandler = new AddDraftPurchaseOrderEventHandler(mongoPurchaseOrderRepository);
// const addPurchaseOrderItemEventHandler = new AddPurchaseOrderItemEventHandler(mongoPurchaseOrderRepository);
// const removePurchaseOrderItemEventHandler = new RemovePurchaseOrderItemEventHandler(mongoPurchaseOrderRepository);
// const updateDraftPurchaseOrderEventHandler = new UpdateDraftPurchaseOrderEventHandler(mongoPurchaseOrderRepository);
// const updatePurchaseOrderItemEventHandler = new UpdatePurchaseOrderItemEventHandler(mongoPurchaseOrderRepository);

mediator.register(LowStockProductEvent.name, lowStockProductEventHandler);
// mediator.register(AddDraftPurchaseOrderEvent.name, addDraftPurchaseOrderEventHandler);
// mediator.register(RemovePurchaseOrderItemEvent.name, removePurchaseOrderItemEventHandler);
// mediator.register(AddPurchaseOrderItemEvent.name, addPurchaseOrderItemEventHandler);
// mediator.register(UpdateDraftPurchaseOrderEvent.name, updateDraftPurchaseOrderEventHandler);
// mediator.register(UpdatePurchaseOrderItemEvent.name, updatePurchaseOrderItemEventHandler);

// Services
const stockService = new StockService(productRepository, mediator);
const productService = new ProductService(productRepository, stockService);
const categoryService = new CategoryService(productRepository);

// Command Handlers
const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(prismaPurchaseOrderRepository);
const removePurchaseOrderItemCommandHandler = new RemovePurchaseOrderItemCommandHandler(prismaPurchaseOrderRepository);
const applyVoucherCommandHandler = new ApplyVoucherCommandHandler(prismaPurchaseOrderRepository);
const updatePurchaseOrderItemQuantityCommandHandler = new UpdatePurchaseOrderItemQuantityCommandHandler(prismaPurchaseOrderRepository);

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
