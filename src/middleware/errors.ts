import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../messages/ErrorResponse";
import config from "../config";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new ErrorResponse(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Handle specific mongoose errors
  if (err.name === "CastError") {
    error = new ErrorResponse("Resource not found", 404);
  }

  if (err.code === 11000) {
    error = new ErrorResponse("Duplicate field value entered", 400);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val: any) => val.message);
    error = new ErrorResponse(message.join(", "), 400);
  }

  const statusCode = (error as any).statusCode || 500;

  const isStandardError =
    error instanceof ErrorResponse || err instanceof ErrorResponse;

  res.status(statusCode).json({
    success: false,
    error: isStandardError ? (error as any).message : "Internal Server Error",
    stack: config.env === "development" ? err.stack : null,
  });
};

export default errorHandler;