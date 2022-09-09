import { Router } from 'express';
import { createSalesController } from '../factories';

const router = Router();

const salesController = createSalesController();

router.post('/orders/items', salesController.addPurchaseOrderItem.bind(salesController));

export default router;
