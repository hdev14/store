import { Router } from 'express';
import bootstrap from '../bootstrap';

const router = Router();

const { authController } = bootstrap.controllers;

router.post('/', authController.auth.bind(authController));
router.patch('/permissions/:userId', authController.addPermission.bind(authController));
router.delete('/permissions/:userId', authController.removePermission.bind(authController));

export default router;
