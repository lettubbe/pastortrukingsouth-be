"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponseHandler = ({ res, statusCode, success, message, data = null }) => {
    res.status(statusCode).json({
        success,
        message,
        // ...(data && { data }), 
        data
    });
    return;
};
exports.default = baseResponseHandler;
