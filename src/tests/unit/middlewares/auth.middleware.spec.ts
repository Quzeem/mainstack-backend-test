// @ts-nocheck
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import httpError from 'http-errors';

import { extractTokenFromHeader, isLoggedIn } from '../../../middlewares/auth.middleware';
import { User } from '../../../models/user.model';

// Mock the jwt module
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('Auth Middleware', () => {
  describe('extractTokenFromHeader', () => {
    it('should return the token when the authorization header is present and has the correct format', () => {
      const request: Request = {
        headers: {
          authorization: 'Bearer jwtToken',
        },
      };

      const result = extractTokenFromHeader(request);
      expect(result).toBe('jwtToken');
    });

    it('should return undefined when the authorization header is missing', () => {
      const request: Request = {
        headers: {},
      };

      const result = extractTokenFromHeader(request);
      expect(result).toBeUndefined();
    });

    it('should return undefined when the authorization header has incorrect format', () => {
      const request: Request = {
        headers: {
          authorization: 'IncorrectFormat',
        },
      };

      const result = extractTokenFromHeader(request);
      expect(result).toBeUndefined();
    });
  });

  describe('isLoggedIn', () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
      req = {};
      res = {};
      next = jest.fn() as NextFunction;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should throw an error if the token is missing', async () => {
      // Mock request object with missing authorization header
      req.headers = {};

      await expect(isLoggedIn(req, res, next)).rejects.toThrow(httpError.Unauthorized);
      expect(next).not.toHaveBeenCalled();
    });

    it('should throw an error if the token could not be verified', async () => {
      // Mock request object with valid authorization header
      req.headers = { authorization: 'Bearer token' };

      jwt.verify.mockImplementation(() => {
        throw new Error();
      });

      await expect(isLoggedIn(req, res, next)).rejects.toThrow(Error);
      expect(next).not.toHaveBeenCalled();
    });

    it('should throw an error if the user assigned the token does not exist', async () => {
      // Mock request object with valid authorization header
      req.headers = { authorization: 'Bearer token' };

      jwt.verify.mockReturnValue({ userId: 'userId' });
      const mockFindById = jest.fn().mockResolvedValue(null);
      User.findById = mockFindById;

      await expect(isLoggedIn(req, res, next)).rejects.toThrow(httpError.Unauthorized);
      expect(next).not.toHaveBeenCalled();
    });

    it('should set the user property on the request object and call next if the token is valid and the user exists', async () => {
      req.headers = { authorization: 'Bearer token' };
      const user = { _id: 'userId', email: 'test@test.com' };

      jwt.verify.mockReturnValue({ userId: 'userId' });
      const mockFindById = jest.fn().mockResolvedValue(user);
      User.findById = mockFindById;

      await isLoggedIn(req, res, next);

      expect(req.user).toMatchObject(user);
      expect(next).toHaveBeenCalled();
    });
  });
});
