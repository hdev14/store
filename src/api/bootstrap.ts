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
import AddDraftPurchaseOrderEvent from '@sales/app/events/AddDraftPurchaseOrderEvent';
import AddDraftPurchaseOrderEventHandler from '@sales/app/events/AddDraftPurchaseOrderEventHandler';
import AddPurchaseOrderItemEvent from '@sales/app/events/AddPurchaseOrderItemEvent';
import AddPurchaseOrderItemEventHandler from '@sales/app/events/AddPurchaseOrderItemEventHandler';
import RemovePurchaseOrderItemEvent from '@sales/app/events/RemovePurchaseOrderItemEvent';
import RemovePurchaseOrderItemEventHandler from '@sales/app/events/RemovePurchaseOrderItemEventHandler';
import UpdateDraftPurchaseOrderEvent from '@sales/app/events/UpdateDraftPurchaseOrderEvent';
import UpdateDraftPurchaseOrderEventHandler from '@sales/app/events/UpdateDraftPurchaseOrderEventHandler';
import UpdatePurchaseOrderItemEvent from '@sales/app/events/UpdatePurchaseOrderItemEvent';
import UpdatePurchaseOrderItemEventHandler from '@sales/app/events/UpdatePurchaseOrderItemEventHandler';
import GetPurchaseOrderItemQuery from '@sales/app/queries/GetPurchaseOrderItemQuery';
import GetPurchaseOrderItemQueryHandler from '@sales/app/queries/GetPurchaseOrderItemQueryHandler';
import GetPurchaseOrderQuery from '@sales/app/queries/GetPurchaseOrderQuery';
import GetPurchaseOrderQueryHandler from '@sales/app/queries/GetPurchaseOrderQueryHandler';
import GetPurchaseOrdersQuery from '@sales/app/queries/GetPurchaseOrdersQuery';
import GetPurchaseOrdersQueryHandler from '@sales/app/queries/GetPurchaseOrdersQueryHandler';
import GetVoucherQuery from '@sales/app/queries/GetVoucherQuery';
import GetVoucherQueryHandler from '@sales/app/queries/GetVoucherQueryHandler';
import MongoPurchaseOrderRepository from '@sales/infra/persistence/MongoPurchaseOrderRepository';
import PrismaPurchaseOrderRepository from '@sales/infra/persistence/PrismaPurchaseOrderRepository';
import EventPublisher from '@shared/EventPublisher';
import StoreMediator from '@shared/StoreMediator';
import generateUUID from '@shared/utils/generateUUID';
import CatalogController from './controllers/CatalogController';
import SalesController from './controllers/SalesController';

// Utils
const storeMediator = new StoreMediator();
const eventPublisher = new EventPublisher(storeMediator);
const emailService = new NodemailerEmailService();

// Repositories
const productRepository = new PrismaProductRepository();
const prismaPurchaseOrderRepository = new PrismaPurchaseOrderRepository();
const mongoPurchaseOrderRepository = new MongoPurchaseOrderRepository();

// Events
const lowStockProductEvent = new LowStockProductEvent(storeMediator);
const lowStockProductEventHandler = new LowStockProductEventHandler(emailService);

// Event Handlers
const addDraftPurchaseOrderEventHandler = new AddDraftPurchaseOrderEventHandler(mongoPurchaseOrderRepository);
const addPurchaseOrderItemEventHandler = new AddPurchaseOrderItemEventHandler(mongoPurchaseOrderRepository);
const removePurchaseOrderItemEventHandler = new RemovePurchaseOrderItemEventHandler(mongoPurchaseOrderRepository);
const updateDraftPurchaseOrderEventHandler = new UpdateDraftPurchaseOrderEventHandler(mongoPurchaseOrderRepository);
const updatePurchaseOrderItemEventHandler = new UpdatePurchaseOrderItemEventHandler(mongoPurchaseOrderRepository);

storeMediator.addEvent(LowStockProductEvent.name, lowStockProductEventHandler);
storeMediator.addEvent(AddDraftPurchaseOrderEvent.name, addDraftPurchaseOrderEventHandler);
storeMediator.addEvent(RemovePurchaseOrderItemEvent.name, removePurchaseOrderItemEventHandler);
storeMediator.addEvent(AddPurchaseOrderItemEvent.name, addPurchaseOrderItemEventHandler);
storeMediator.addEvent(UpdateDraftPurchaseOrderEvent.name, updateDraftPurchaseOrderEventHandler);
storeMediator.addEvent(UpdatePurchaseOrderItemEvent.name, updatePurchaseOrderItemEventHandler);

// Services
const stockService = new StockService(productRepository, lowStockProductEvent);
const productService = new ProductService(productRepository, generateUUID, stockService);
const categoryService = new CategoryService(productRepository, generateUUID);

// Commands
const addPurchaseOrderItemCommand = new AddPurchaseOrderItemCommand(storeMediator);
const removePurchaseOrderItemCommand = new RemovePurchaseOrderItemCommand(storeMediator);
const applyVoucherCommand = new ApplyVoucherCommand(storeMediator);
const updatePurchaseOrderItemQuantityCommand = new UpdatePurchaseOrderItemQuantityCommand(storeMediator);

// Command Handlers
const addPurchaseOrderItemCommandHandler = new AddPurchaseOrderItemCommandHandler(prismaPurchaseOrderRepository, generateUUID, eventPublisher);
const removePurchaseOrderItemCommandHandler = new RemovePurchaseOrderItemCommandHandler(prismaPurchaseOrderRepository, eventPublisher);
const applyVoucherCommandHandler = new ApplyVoucherCommandHandler(prismaPurchaseOrderRepository);
const updatePurchaseOrderItemQuantityCommandHandler = new UpdatePurchaseOrderItemQuantityCommandHandler(prismaPurchaseOrderRepository, eventPublisher);

storeMediator.addEvent(AddPurchaseOrderItemCommand.name, addPurchaseOrderItemCommandHandler);
storeMediator.addEvent(RemovePurchaseOrderItemCommand.name, removePurchaseOrderItemCommandHandler);
storeMediator.addEvent(ApplyVoucherCommand.name, applyVoucherCommandHandler);
storeMediator.addEvent(UpdatePurchaseOrderItemQuantityCommand.name, updatePurchaseOrderItemQuantityCommandHandler);

// Queries
const getPurchaseOrderQuery = new GetPurchaseOrderQuery(storeMediator);
const getPurchaseOrdersQuery = new GetPurchaseOrdersQuery(storeMediator);
const getPurchaseOrderItemQuery = new GetPurchaseOrderItemQuery(storeMediator);
const getVoucherQuery = new GetVoucherQuery(storeMediator);

// Query Handlers
const getPurchaseOrderQueryHandler = new GetPurchaseOrderQueryHandler(mongoPurchaseOrderRepository);
const getPurchaseOrdersQueryHandler = new GetPurchaseOrdersQueryHandler(mongoPurchaseOrderRepository);
const getPurchaseOrderItemQueryHandler = new GetPurchaseOrderItemQueryHandler(mongoPurchaseOrderRepository);
const getVoucherQueryHandler = new GetVoucherQueryHandler(mongoPurchaseOrderRepository);

storeMediator.addEvent(GetPurchaseOrderQuery.name, getPurchaseOrderQueryHandler);
storeMediator.addEvent(GetPurchaseOrdersQuery.name, getPurchaseOrdersQueryHandler);
storeMediator.addEvent(GetPurchaseOrderItemQuery.name, getPurchaseOrderItemQueryHandler);
storeMediator.addEvent(GetVoucherQuery.name, getVoucherQueryHandler);

// Controllers
const catalogController = new CatalogController(productService, categoryService);
const salesController = new SalesController(
  addPurchaseOrderItemCommand,
  removePurchaseOrderItemCommand,
  applyVoucherCommand,
  updatePurchaseOrderItemQuantityCommand,
  getPurchaseOrderQuery,
  getPurchaseOrdersQuery,
  getPurchaseOrderItemQuery,
  getVoucherQuery,
);

export default {
  controllers: {
    salesController,
    catalogController,
  },
};
