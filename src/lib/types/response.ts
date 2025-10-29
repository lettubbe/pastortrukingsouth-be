import { Response } from 'express';

export interface ErrorResponseHandlerParams {
  message: string;
  res: Response;
  statusCode: number;
}

export interface BaseResponseHandlerParams<T = any> {
  message: string;
  res: Response;
  statusCode: number;
  success: boolean;
  data?: T;
}