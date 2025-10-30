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
exports.getAllUploadedResources = exports.uploadMediaResource = exports.createTextResource = exports.uploadAudioResource = exports.uploadVideoResource = exports.uploadPhotoResource = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const fileUpload_1 = require("../lib/utils/fileUpload");
const Reources_1 = __importDefault(require("../models/Reources"));
const BaseResponseHandler_1 = __importDefault(require("../messages/BaseResponseHandler"));
const ErrorResponse_1 = __importDefault(require("../messages/ErrorResponse"));
// @route   /api/v1/reosurce/resources/photo
// @desc    Uploads A Photo Resource
// @access  public
exports.uploadPhotoResource = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const thumbnailImage = yield (0, fileUpload_1.uploadFileFromFields)(req, next, `thumbnails/`, "thumbnail");
    const mediaPhoto = yield (0, fileUpload_1.uploadFileFromFields)(req, next, `mediaPhoto/`, "photo");
    const { authorName, content, caption } = req.body;
    if (!thumbnailImage || !mediaPhoto) {
        return next(new ErrorResponse_1.default(`Thumbnail and Media Photo is Required`, 400));
    }
    const _photo = yield Reources_1.default.create({
        type: "photo",
        thumbnail: thumbnailImage,
        mediaUrl: mediaPhoto,
        authorName,
        content,
        caption,
    });
    (0, BaseResponseHandler_1.default)({
        message: `Photo uploaded successfuuly`,
        res,
        statusCode: 200,
        success: true,
        data: _photo,
    });
}));
exports.uploadVideoResource = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const thumbnailImage = yield (0, fileUpload_1.uploadFileFromFields)(req, next, `thumbnail/`, "thumbnail");
    const mediaVideo = yield (0, fileUpload_1.uploadFileFromFields)(req, next, `mediaVideo/`, "video");
    const { authorName, content, caption } = req.body;
    if (!thumbnailImage || !mediaVideo) {
        return next(new ErrorResponse_1.default(`Thumbnail and Media Video is Required`, 400));
    }
    const _video = yield Reources_1.default.create({
        type: "video",
        mediaUrl: mediaVideo,
        authorName,
        content,
        caption,
    });
    (0, BaseResponseHandler_1.default)({
        message: `Video uploaded successfuuly`,
        res,
        statusCode: 200,
        success: true,
        data: _video,
    });
}));
exports.uploadAudioResource = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const audio = yield (0, fileUpload_1.uploadFile)(req, next, "audio");
    const { authorName, content, caption } = req.body;
    if (!audio) {
        return next(new ErrorResponse_1.default(`Audio is Required`, 400));
    }
    const _audio = yield Reources_1.default.create({
        type: "audio",
        mediaUrl: audio,
        authorName,
        content,
        caption,
    });
    (0, BaseResponseHandler_1.default)({
        message: `Audio uploaded successfuuly`,
        res,
        statusCode: 200,
        success: true,
        data: _audio,
    });
}));
exports.createTextResource = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorName, content, caption } = req.body;
    const textResource = yield Reources_1.default.create({
        type: "text",
        authorName,
        content,
        caption,
    });
    (0, BaseResponseHandler_1.default)({
        message: `Video uploaded successfuuly`,
        res,
        statusCode: 200,
        success: true,
        data: textResource,
    });
}));
exports.uploadMediaResource = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const mediaResource = yield (0, fileUpload_1.uploadFile)(req, next, "mediaUploads");
    if (!mediaResource) {
        return (next(new ErrorResponse_1.default(`File Upload Failed`, 400)));
    }
    const { text } = req.body;
    const uploadedResource = yield Reources_1.default.create({ type: "media", mediaUrl: mediaResource, text });
    (0, BaseResponseHandler_1.default)({
        message: `Upload Media Resource successfull`,
        res,
        statusCode: 200,
        success: true,
        data: uploadedResource
    });
}));
exports.getAllUploadedResources = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.query;
    let query = {};
    if (type && (type === "audio" || type === "video" || type == "media")) {
        query = { type };
    }
    const resources = yield Reources_1.default.find(query);
    (0, BaseResponseHandler_1.default)({
        message: `Resources retrieved successfully`,
        res,
        statusCode: 200,
        success: true,
        data: resources,
    });
}));
