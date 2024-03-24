import httpError from 'http-errors';
import { Request, Response } from 'express';

import { validateSignUpData, validateLoginData } from '../helpers/validators/auth.validators';
import { UserAttrs } from '../models/user.model';
import * as authService from '../services/auth.service';

export const signUp = async (req: Request, res: Response) => {
  const { error, value } = validateSignUpData(req);
  if (error) throw new httpError.BadRequest(error.message);

  await authService.signUp(value as UserAttrs);

  res.status(201).send({
    status: 'success',
    message: 'User registered successfully',
  });
};

export const login = async (req: Request, res: Response) => {
  const { error, value } = validateLoginData(req);
  if (error) throw new httpError.BadRequest(error.message);

  const token = await authService.login(value as UserAttrs);

  res.status(200).send({
    status: 'success',
    message: 'Login successfully',
    data: { token },
  });
};

export const getProfile = (req: Request, res: Response) => {
  res.status(200).send({
    status: 'success',
    message: 'User profile retrieved successfully',
    data: { user: req.user },
  });
};
