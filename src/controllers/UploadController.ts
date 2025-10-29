import asyncHandler from "express-async-handler";
import { uploadFile, uploadFileFromFields } from "../lib/utils/fileUpload";
import UploadResource from "../models/Reources";
import baseResponseHandler from "../messages/BaseResponseHandler";
import ErrorResponse from "../messages/ErrorResponse";

export const uploadPhotoResource = asyncHandler(async (req, res, next) => {
  const thumbnailImage = await uploadFileFromFields(
    req,
    next,
    `thumbnails/`,
    "thumbnail"
  );

  const mediaPhoto = await uploadFileFromFields(
    req,
    next,
    `mediaPhoto/`,
    "photo"
  );

  const { authorName, content, caption } = req.body;

  if (!thumbnailImage || !mediaPhoto) {
    return next(new ErrorResponse(`Thumbnail and Media Photo is Required`, 400));
  }

  const _photo = await UploadResource.create({
    type: "audio",
    thumbnail: thumbnailImage,
    mediaUrl: mediaPhoto,
    authorName,
    content,
    caption,
  });

  baseResponseHandler({
    message: `Photo uploaded successfuuly`,
    res,
    statusCode: 200,
    success: true,
    data: _photo,
  });
});

export const uploadVideoResource = asyncHandler(async (req, res, next) => {


  const thumbnailImage = await uploadFileFromFields(
    req,
    next,
    `thumbnail/`,
    "thumbnail"
  );

  const mediaVideo = await uploadFileFromFields(
    req,
    next,
    `mediaVideo/`,
    "video"
  );

  const { authorName, content, caption } = req.body;

  if (!thumbnailImage || !mediaVideo) {
    return next(new ErrorResponse(`Thumbnail and Media Video is Required`, 400));
  }

  const _video = await UploadResource.create({
    type: "video",
    mediaUrl: mediaVideo,
    authorName,
    content,
    caption,
  });

  baseResponseHandler({
    message: `Video uploaded successfuuly`,
    res,
    statusCode: 200,
    success: true,
    data: _video,
  });
});

export const getAllUploadedResources = asyncHandler(async (req, res, next) => {
  const { type } = req.query;

  let query = {};
  if (type && (type === "audio" || type === "video" || type == "media")) {
    query = { type };
  }

  const resources = await UploadResource.find(query);

  baseResponseHandler({
    message: `Resources retrieved successfully`,
    res,
    statusCode: 200,
    success: true,
    data: resources,
  });
});
