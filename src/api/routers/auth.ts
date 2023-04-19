import { Router } from 'express';
import auth from '@api/middlewares/auth';
import bootstrap from '../bootstrap';

const router = Router();

const { authController } = bootstrap.controllers;

router.post('/', authController.auth.bind(authController));

router.use(auth);

router.patch('/permissions/:userId', authController.addPermission.bind(authController));
router.delete('/permissions/:userId', authController.removePermission.bind(authController));

export default router;
