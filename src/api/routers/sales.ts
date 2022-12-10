import { Router } from 'express';
import bootstrap from '../bootstrap';

const router = Router();

const { salesController } = bootstrap.controllers;

router.get('/orders/:id', salesController.getPurchaseOrder.bind(salesController));

router.get('/customers/:customerId/orders', salesController.getPurchaseOrders.bind(salesController));

router.get('/orders/items/:id', salesController.getPurchaseOrderItem.bind(salesController));

router.get('/vouchers/:code', salesController.getVoucher.bind(salesController));

router.post('/orders/items', salesController.addPurchaseOrderItem.bind(salesController));

router.delete('/orders/items/:id', salesController.removePurchaseOrderItem.bind(salesController));

router.patch('/orders/items/:id/quantities', salesController.updatePurchaseOrderItemQuantity.bind(salesController));

router.post('/orders/:id/vouchers', salesController.applyVoucher.bind(salesController));

export default router;
