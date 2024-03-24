import httpError from 'http-errors';

import { Product, ProductAttrs, ProductDoc } from '../models/product.model';
import { UserDoc } from '../models/user.model';

export const createProduct = async (user: UserDoc, data: ProductAttrs): Promise<ProductDoc> => {
  const product = Product.build({ ...data, user: user._id });
  await product.save();

  return product;
};

export const getProducts = async (user: UserDoc): Promise<ProductDoc[]> => {
  const products = await Product.find({ user });
  return products;
};

export const getProduct = async (productId: string, user: UserDoc): Promise<ProductDoc> => {
  const product = await Product.findOne({ _id: productId, user });
  if (!product) throw new httpError.NotFound('Product not found');

  return product;
};

export const updateProduct = async (
  productId: string,
  changes: ProductAttrs,
  user: UserDoc,
): Promise<ProductDoc> => {
  const product = await Product.findOneAndUpdate({ _id: productId, user }, changes, { new: true });
  if (!product) throw new httpError.NotFound('Product not found');

  return product;
};

export const deleteProduct = async (productId: string, user: UserDoc): Promise<ProductDoc> => {
  const product = await Product.findOneAndDelete({ _id: productId, user });
  if (!product) throw new httpError.NotFound('Product not found');

  return product;
};
