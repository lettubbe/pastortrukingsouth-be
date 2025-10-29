"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const ErrorResponse_1 = __importDefault(require("../messages/ErrorResponse"));
const config_1 = __importDefault(require("../config"));
const notFound = (req, res, next) => {
    const error = new ErrorResponse_1.default(`Not Found - ${req.originalUrl}`, 404);
    next(error);
};
exports.notFound = notFound;
const errorHandler = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let error = Object.assign({}, err);
    error.message = err.message;
    // Handle specific mongoose errors
    if (err.name === "CastError") {
        error = new ErrorResponse_1.default("Resource not found", 404);
    }
    if (err.code === 11000) {
        error = new ErrorResponse_1.default("Duplicate field value entered", 400);
    }
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((val) => val.message);
        error = new ErrorResponse_1.default(message.join(", "), 400);
    }
    const statusCode = error.statusCode || 500;
    const isStandardError = error instanceof ErrorResponse_1.default || err instanceof ErrorResponse_1.default;
    res.status(statusCode).json({
        success: false,
        error: isStandardError ? error.message : "Internal Server Error",
        stack: config_1.default.env === "development" ? err.stack : null,
    });
});
exports.default = errorHandler;
