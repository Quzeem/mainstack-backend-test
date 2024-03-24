/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';

import * as productController from '../controllers/product.controller';
import { isLoggedIn } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(isLoggedIn);

router.post('/', productController.createProduct);
router.get('/', productController.getProducts);
router.get('/:productId', productController.getProduct);
router.patch('/:productId', productController.updateProduct);
router.delete('/:productId', productController.deleteProduct);

export { router as productRouter };
