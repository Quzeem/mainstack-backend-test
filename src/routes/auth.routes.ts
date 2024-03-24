/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';

import * as authController from '../controllers/auth.controller';
import { isLoggedIn } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/sign-up', authController.signUp);
router.post('/login', authController.login);
router.get('/profile', isLoggedIn, authController.getProfile);

export { router as authRouter };
