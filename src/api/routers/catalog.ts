import { Router } from 'express';
import auth from '@api/middlewares/auth';
import bootstrap from '../bootstrap';

const router = Router();

const { catalogController } = bootstrap.controllers;

router.get('/products', catalogController.getAllProducts.bind(catalogController));

router.get('/products/:id', catalogController.getProductById.bind(catalogController));

router.get('/products/categories/:id', catalogController.getProductsByCategory.bind(catalogController));

router.get('/categories', catalogController.getAllCategories.bind(catalogController));

router.use(auth);

router.post('/products', catalogController.createProduct.bind(catalogController));

router.put('/products/:id', catalogController.updateProduct.bind(catalogController));

router.patch('/products/:id/stock', catalogController.updateProductStock.bind(catalogController));

router.post('/categories', catalogController.createCategory.bind(catalogController));

router.put('/categories/:id', catalogController.updateCategory.bind(catalogController));

export default router;
