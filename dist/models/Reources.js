"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UploadSchema = new mongoose_1.Schema({
    type: {
        type: String,
        required: [true, "Type is required"],
    },
    mediaUrl: {
        type: String,
    },
    authorName: {
        type: String,
    },
    text: {
        type: String,
    },
    content: {
        type: String,
    },
    thumbnail: {
        type: String,
    },
    caption: {
        type: String,
    },
    moderationStatus: {
        type: String,
        default: "pending"
    }
}, { timestamps: true });
const UploadResource = (0, mongoose_1.model)("resource", UploadSchema);
exports.default = UploadResource;
