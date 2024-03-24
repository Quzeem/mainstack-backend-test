import httpError from 'http-errors';
import { Request, Response } from 'express';

import {
  validateProductCreationData,
  validateProductUpdatesData,
} from '../helpers/validators/product.validators';
import * as productService from '../services/product.service';
import { ProductAttrs } from '../models/product.model';

export const createProduct = async (req: Request, res: Response) => {
  const { error, value } = validateProductCreationData(req);
  if (error) throw new httpError.BadRequest(error.message);

  const product = await productService.createProduct(req.user!, value as ProductAttrs);

  res.status(201).send({
    status: 'success',
    message: 'Product created successfully',
    data: { product },
  });
};

export const getProducts = async (req: Request, res: Response) => {
  const products = await productService.getProducts(req.user!);

  res.status(200).send({
    status: 'success',
    message: 'Products retrieved successfully',
    data: { products },
  });
};

export const getProduct = async (req: Request, res: Response) => {
  const product = await productService.getProduct(req.params.productId, req.user!);

  res.status(200).send({
    status: 'success',
    message: 'Product retrieved successfully',
    data: { product },
  });
};

export const updateProduct = async (req: Request, res: Response) => {
  const { error, value } = validateProductUpdatesData(req);
  if (error) throw new httpError.BadRequest(error.message);

  const product = await productService.updateProduct(
    req.params.productId,
    value as ProductAttrs,
    req.user!,
  );

  res.status(200).send({
    status: 'success',
    message: 'Product updated successfully',
    data: { product },
  });
};

export const deleteProduct = async (req: Request, res: Response) => {
  await productService.deleteProduct(req.params.productId, req.user!);

  res.status(200).send({
    status: 'success',
    message: 'Product deleted successfully',
    data: {},
  });
};
