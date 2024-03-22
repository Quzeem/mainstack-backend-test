/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';

import * as authController from '../controllers/auth.controller';
import { isLoggedIn } from '../middlewares/auth.middleware';

const authRouter = express.Router();

authRouter.post('/sign-up', authController.signUp);
authRouter.post('/login', authController.login);
authRouter.get('/profile', isLoggedIn, authController.getProfile);

export default authRouter;
