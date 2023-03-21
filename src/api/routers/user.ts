import { Router } from 'express';
import bootstrap from '../bootstrap';

const router = Router();

const { userController } = bootstrap.controllers;

// TODO: add all endpoints
router.post('/', userController.createUser.bind(userController));

export default router;
