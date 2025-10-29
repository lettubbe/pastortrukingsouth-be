"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponseHandler = void 0;
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
const ErrorResponseHandler = ({ message, res, statusCode, }) => {
    res.status(statusCode).json({
        success: false,
        message,
        error: message,
    });
};
exports.ErrorResponseHandler = ErrorResponseHandler;
exports.default = ErrorResponse;
