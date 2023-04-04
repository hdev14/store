import { Router } from 'express';
import bootstrap from '../bootstrap';

const router = Router();

const { authController } = bootstrap.controllers;

router.post('/', authController.auth.bind(authController));
router.patch('/permissions/:userId/:permission', authController.addPermission.bind(authController));
router.delete('/permissions/:userId/:permission', authController.removePermission.bind(authController));

export default router;
