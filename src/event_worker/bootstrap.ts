import BullmqEventWorker from '@shared/BullmqEventWorker';
import EventMediator from '@shared/EventMediator';
import AddDraftPurchaseOrderEvent from '@sales/domain/events/AddDraftPurchaseOrderEvent';
import AddPurchaseOrderItemEvent from '@sales/domain/events/AddPurchaseOrderItemEvent';
import RemovePurchaseOrderItemEvent from '@sales/domain/events/RemovePurchaseOrderItemEvent';
import UpdateDraftPurchaseOrderEvent from '@sales/domain/events/UpdateDraftPurchaseOrderEvent';
// import UpdatePurchaseOrderEvent from '@sales/domain/events/UpdatePurchaseOrderEvent';
import UpdatePurchaseOrderItemEvent from '@sales/domain/events/UpdatePurchaseOrderItemEvent';
import AddDraftPurchaseOrderEventHandler from '@sales/app/handlers/AddDraftPurchaseOrderEventHandler';
import MongoosePurchaseOrderRepository from '@sales/infra/persistence/MongoosePurchaseOrderRepository';
import AddPurchaseOrderItemEventHandler from '@sales/app/handlers/AddPurchaseOrderItemEventHandler';
import RemovePurchaseOrderItemEventHandler from '@sales/app/handlers/RemovePurchaseOrderItemEventHandler';
import UpdateDraftPurchaseOrderEventHandler from '@sales/app/handlers/UpdateDraftPurchaseOrderEventHandler';
import UpdatePurchaseOrderItemEventHandler from '@sales/app/handlers/UpdatePurchaseOrderItemEventHandler';

const eventMediator = new EventMediator();
const mongoosePurchaseOrderRepository = new MongoosePurchaseOrderRepository();

const addDraftPurchaseOrderEventHandler = new AddDraftPurchaseOrderEventHandler(mongoosePurchaseOrderRepository);
const addPurchaseOrderItemEventHandler = new AddPurchaseOrderItemEventHandler(mongoosePurchaseOrderRepository);
const removePurchaseOrderItemEventHandler = new RemovePurchaseOrderItemEventHandler(mongoosePurchaseOrderRepository);
const updateDraftPurchaseOrderEventHandler = new UpdateDraftPurchaseOrderEventHandler(mongoosePurchaseOrderRepository);
const updatePurchaseOrderItemEventHandler = new UpdatePurchaseOrderItemEventHandler(mongoosePurchaseOrderRepository);

eventMediator.register(AddDraftPurchaseOrderEvent.name, addDraftPurchaseOrderEventHandler);
eventMediator.register(AddPurchaseOrderItemEvent.name, addPurchaseOrderItemEventHandler);
eventMediator.register(RemovePurchaseOrderItemEvent.name, removePurchaseOrderItemEventHandler);
eventMediator.register(UpdateDraftPurchaseOrderEvent.name, updateDraftPurchaseOrderEventHandler);
eventMediator.register(UpdatePurchaseOrderItemEvent.name, updatePurchaseOrderItemEventHandler);

const eventWorker = new BullmqEventWorker(eventMediator);

export default eventWorker;
