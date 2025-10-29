import { ErrorResponseHandlerParams } from "../lib/types/response";


class ErrorResponse extends Error {
  statusCode: number;

  constructor(message: any, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const ErrorResponseHandler = ({
  message,
  res,
  statusCode,
}: ErrorResponseHandlerParams): void => {
  res.status(statusCode).json({
    success: false,
    message,
    error: message,
  });
};

export default ErrorResponse;
