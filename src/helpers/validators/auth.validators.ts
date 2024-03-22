import Joi from 'joi';
import { Request } from 'express';

/** Validates signup data */
export const validateSignUpData = (req: Request) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .regex(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=\S+$).{8,}$/)
      .messages({
        'string.pattern.base': 'Password must contain at least one letter and one numeric digit',
      })
      .required(),
  });

  return schema.validate(req.body);
};

/** Validates login data */
export const validateLoginData = (req: Request) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(req.body);
};
