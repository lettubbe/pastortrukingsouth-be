import asyncHandler from "express-async-handler";
import { uploadFile, uploadFileFromFields } from "../lib/utils/fileUpload";
import UploadResource from "../models/Reources";
import baseResponseHandler from "../messages/BaseResponseHandler";
import ErrorResponse from "../messages/ErrorResponse";

// @route   /api/v1/reosurce/resources/photo
// @desc    Uploads A Photo Resource
// @access  public

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

export const uploadAudioResource = asyncHandler(async (req, res, next) => {

  const audio = await uploadFile(req, next, "audio");

  const { authorName, content, caption } = req.body;

  if (!audio) {
    return next(new ErrorResponse(`Audio is Required`, 400));
  }

  const _audio = await UploadResource.create({
    type: "audio",
    mediaUrl: audio,
    authorName,
    content,
    caption,
  });

  baseResponseHandler({
    message: `Audio uploaded successfuuly`,
    res,
    statusCode: 200,
    success: true,
    data: _audio,
  });
});

export const createTextResource = asyncHandler(async (req, res, next) => {

  const { authorName, content, caption } = req.body;

  const textResource = await UploadResource.create({
    type: "text",
    authorName,
    content,
    caption,
  });

  baseResponseHandler({
    message: `Video uploaded successfuuly`,
    res,
    statusCode: 200,
    success: true,
    data: textResource,
  });
});

export const uploadMediaResource = asyncHandler(async (req, res, next) => {
    
    const mediaResource = await uploadFile(req, next, "mediaUploads");
    
    if(!mediaResource){
        return(next(new ErrorResponse(`File Upload Failed`, 400)));
    }

    const { text } = req.body;
    
    const uploadedResource = await UploadResource.create({ type: "media", mediaUrl: mediaResource, text });

    baseResponseHandler({
        message: `Upload Media Resource successfull`,
        res,
        statusCode: 200,
        success: true,
        data: uploadedResource
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
