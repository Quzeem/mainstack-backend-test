// @ts-nocheck
import httpError from 'http-errors';

import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from './../../../services/product.service';
import { Product, ProductAttrs, ProductDoc } from '../../../models/product.model';
import { UserDoc } from '../../../models/user.model';

describe('Product Service', () => {
  const user: UserDoc = { _id: 'userId' };
  const productId = '66000e1d7f4bf797a475c165';
  const productDoc: ProductDoc = {
    _id: productId,
    user: user._id,
    name: 'AirPod',
    imageURL: 'image.jpg',
    category: 'Electronics',
    description: 'description goes here',
    price: 10,
    countInStock: 1,
  };

  describe('createProduct', () => {
    it('should create a new product specific for a user and return the product', async () => {
      const data: ProductAttrs = {
        name: 'AirPod',
        imageURL: 'image.jpg',
        category: 'Electronics',
        description: 'description goes here',
        price: 10,
        countInStock: 1,
      };

      const saveMock = jest.fn();
      const buildMock = jest.fn().mockReturnValue({ ...productDoc, save: saveMock });
      Product.build = buildMock;

      const result = await createProduct(user, data);

      expect(buildMock).toHaveBeenCalledWith({ ...data, user: user._id });
      expect(saveMock).toHaveBeenCalled();
      expect(result).toMatchObject(productDoc);
    });
  });

  describe('getProducts', () => {
    it('should get a user products', async () => {
      const findMock = jest.fn().mockResolvedValue('some value');
      Product.find = findMock;

      expect(findMock).not.toHaveBeenCalled();

      const result = await getProducts(user);

      expect(findMock).toHaveBeenCalledWith({ user });
      expect(result).toEqual('some value');
    });
  });

  describe('getProduct', () => {
    it('should get a user product', async () => {
      const findOneMock = jest.fn().mockResolvedValue(productDoc);
      Product.findOne = findOneMock;

      expect(findOneMock).not.toHaveBeenCalled();

      const result = await getProduct(productId, user);

      expect(findOneMock).toHaveBeenCalledWith({ _id: productId, user });
      expect(result).toEqual(productDoc);
    });

    it('should throw an error if the product is not found', async () => {
      const findOneMock = jest.fn().mockResolvedValue(null);
      Product.findOne = findOneMock;

      await expect(getProduct(productId, user)).rejects.toThrow(httpError.NotFound);
    });
  });

  describe('updateProduct', () => {
    const changes: ProductAttrs = { countInStock: 5 };

    it('should update a user product', async () => {
      const findOneAndUpdateMock = jest.fn().mockResolvedValue({ ...productDoc, ...changes });
      Product.findOneAndUpdate = findOneAndUpdateMock;

      expect(findOneAndUpdateMock).not.toHaveBeenCalled();

      const result = await updateProduct(productId, changes, user);

      expect(findOneAndUpdateMock).toHaveBeenCalledWith({ _id: productId, user }, changes, {
        new: true,
      });
      expect(result).toEqual({ ...productDoc, ...changes });
    });

    it('should throw an error if the product is not found', async () => {
      const findOneAndUpdateMock = jest.fn().mockResolvedValue(null);
      Product.findOneAndUpdate = findOneAndUpdateMock;

      await expect(updateProduct(productId, changes, user)).rejects.toThrow(httpError.NotFound);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a user product', async () => {
      const findOneAndDeleteMock = jest.fn().mockResolvedValue(productDoc);
      Product.findOneAndDelete = findOneAndDeleteMock;

      expect(findOneAndDeleteMock).not.toHaveBeenCalled();

      const result = await deleteProduct(productId, user);

      expect(findOneAndDeleteMock).toHaveBeenCalledWith({ _id: productId, user });
      expect(result).toEqual(productDoc);
    });

    it('should throw an error if the product is not found', async () => {
      const findOneAndDeleteMock = jest.fn().mockResolvedValue(null);
      Product.findOneAndDelete = findOneAndDeleteMock;

      await expect(deleteProduct(productId, user)).rejects.toThrow(httpError.NotFound);
    });
  });
});
