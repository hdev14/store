import { Router } from 'express';
import auth from '@api/middlewares/auth';
import bootstrap from '../bootstrap';

const router = Router();

const { userController } = bootstrap.controllers;

router.use(auth);

router.post('/', userController.createUser.bind(userController));
router.put('/:id', userController.updateUser.bind(userController));
router.get('/:id', userController.getUser.bind(userController));
router.get('/', userController.getUsers.bind(userController));

export default router;
