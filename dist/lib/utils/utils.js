"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = exports.removeSensitiveFields = void 0;
const ErrorResponse_1 = __importDefault(require("../../messages/ErrorResponse"));
const removeSensitiveFields = (user, fields = ["password"]) => {
    const userData = Object.assign({}, user.toObject());
    fields.forEach((field) => delete userData[field]);
    return userData;
};
exports.removeSensitiveFields = removeSensitiveFields;
const validateRequest = (schema) => {
    return (req, res, next) => {
        // Validate request body if schema includes body validation
        if (schema.body) {
            const { error: bodyError } = schema.body.validate(req.body, {
                allowUnknown: true,
            });
            if (bodyError) {
                return next(new ErrorResponse_1.default(bodyError.details[0].message, 400));
            }
        }
        // Validate query parameters if schema includes query validation
        if (schema.query) {
            const { error: queryError } = schema.query.validate(req.query, {
                allowUnknown: true,
            });
            if (queryError) {
                return next(new ErrorResponse_1.default(queryError.details[0].message, 400));
            }
        }
        // Validate URL parameters if schema includes params validation
        if (schema.params) {
            const { error: paramsError } = schema.params.validate(req.params, {
                allowUnknown: true,
            });
            if (paramsError) {
                return next(new ErrorResponse_1.default(paramsError.details[0].message, 400));
            }
        }
        next();
    };
};
exports.validateRequest = validateRequest;
