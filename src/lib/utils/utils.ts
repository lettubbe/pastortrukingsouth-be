
import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../../messages/ErrorResponse";
import Joi from "joi";


export const removeSensitiveFields = <T extends Record<string, any>>(
  user: T,
  fields: string[] = ["password"]
): Omit<T, "password"> => {
  const userData = { ...user.toObject() };
  fields.forEach((field) => delete userData[field]);
  return userData;
};

interface RequestSchema {
  body?: Joi.ObjectSchema<any>;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}

export const validateRequest = (schema: RequestSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Validate request body if schema includes body validation
    if (schema.body) {
      const { error: bodyError } = schema.body.validate(req.body, {
        allowUnknown: true,
      });
      if (bodyError) {
        return next(new ErrorResponse(bodyError.details[0].message, 400));
      }
    }

    // Validate query parameters if schema includes query validation
    if (schema.query) {
      const { error: queryError } = schema.query.validate(req.query, {
        allowUnknown: true,
      });
      if (queryError) {
        return next(new ErrorResponse(queryError.details[0].message, 400));
      }
    }

    // Validate URL parameters if schema includes params validation
    if (schema.params) {
      const { error: paramsError } = schema.params.validate(req.params, {
        allowUnknown: true,
      });
      if (paramsError) {
        return next(new ErrorResponse(paramsError.details[0].message, 400));
      }
    }
    next();
  };
};