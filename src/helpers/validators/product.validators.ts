import Joi from 'joi';
import { Request } from 'express';

export const validateProductCreationData = (req: Request) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    imageURL: Joi.string().required(),
    category: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().options({ convert: false }).required(),
    countInStock: Joi.number().options({ convert: false }).required(),
  });

  return schema.validate(req.body);
};

export const validateProductUpdatesData = (req: Request) => {
  const schema = Joi.object({
    name: Joi.string(),
    imageURL: Joi.string(),
    category: Joi.string(),
    description: Joi.string(),
    price: Joi.number().options({ convert: false }),
    countInStock: Joi.number().options({ convert: false }),
  }).min(1);

  return schema.validate(req.body);
};
