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
exports.uploadFileFromFields = exports.uploadMultipleFilesFromFields = exports.uploadFile = void 0;
exports.getMimeTypeFromBase64 = getMimeTypeFromBase64;
exports.getExtensionFromMimeType = getExtensionFromMimeType;
const uuid_1 = require("uuid");
const ErrorResponse_1 = __importDefault(require("../../messages/ErrorResponse"));
const config_1 = __importDefault(require("../../config"));
const s3_1 = require("./s3");
const uploadFile = (req_1, next_1, folder_1, ...args_1) => __awaiter(void 0, [req_1, next_1, folder_1, ...args_1], void 0, function* (req, next, folder, optional = false) {
    const file = req.file;
    // console.log("upload file", file);
    // if (!file) {
    //   return next(new ErrorResponse("No file uploaded", 400));
    // }
    if (!file) {
        if (optional) {
            return null;
        }
        return next(new ErrorResponse_1.default("No file uploaded", 400));
    }
    // console.log("file", file);
    const fileExtension = file.originalname.split(".").pop();
    const s3Params = {
        Bucket: config_1.default.aws.s3Bucket,
        Key: `${folder}/${(0, uuid_1.v4)()}.${fileExtension}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    try {
        const uploadResult = yield s3_1.s3.upload(s3Params).promise();
        return uploadResult.Location;
    }
    catch (error) {
        console.log("error uploading profile picture", error);
        return next(new ErrorResponse_1.default("Error uploading file", 500));
    }
});
exports.uploadFile = uploadFile;
const uploadMultipleFilesFromFields = (req_1, next_1, folder_1, fieldName_1, ...args_1) => __awaiter(void 0, [req_1, next_1, folder_1, fieldName_1, ...args_1], void 0, function* (req, next, folder, fieldName, optional = false) {
    const files = req.files;
    console.log("files", files);
    // Validate the files object
    if (!files || typeof files !== "object" || Array.isArray(files)) {
        if (optional) {
            return undefined;
        }
        next(new ErrorResponse_1.default(`Invalid file format for field "${fieldName}"`, 400));
        return undefined;
    }
    const fileList = files[fieldName];
    // If no files and optional, skip
    if (!fileList || !Array.isArray(fileList) || fileList.length === 0) {
        if (optional) {
            return undefined;
        }
        next(new ErrorResponse_1.default(`No files uploaded for field "${fieldName}"`, 400));
        return undefined;
    }
    const uploadedUrls = [];
    try {
        for (const file of fileList) {
            const fileExtension = file.originalname.split(".").pop();
            const s3Params = {
                Bucket: config_1.default.aws.s3Bucket,
                Key: `${folder}/${(0, uuid_1.v4)()}.${fileExtension}`,
                Body: file.buffer,
                ContentType: file.mimetype,
            };
            const uploadResult = yield s3_1.s3.upload(s3Params).promise();
            uploadedUrls.push(uploadResult.Location);
        }
        return uploadedUrls;
    }
    catch (error) {
        console.error("Error uploading multiple files to S3:", error);
        next(new ErrorResponse_1.default("Error uploading multiple files", 500));
        return undefined;
    }
});
exports.uploadMultipleFilesFromFields = uploadMultipleFilesFromFields;
const uploadFileFromFields = (req_1, next_1, folder_1, fieldName_1, ...args_1) => __awaiter(void 0, [req_1, next_1, folder_1, fieldName_1, ...args_1], void 0, function* (req, next, folder, fieldName, optional = false) {
    var _a;
    const files = req.files;
    console.log("files", files);
    // Validate the files object
    if (!files || typeof files !== "object" || Array.isArray(files)) {
        if (optional) {
            return undefined;
        }
        next(new ErrorResponse_1.default(`Invalid file format for field "${fieldName}"`, 400));
        return undefined;
    }
    const file = (_a = files[fieldName]) === null || _a === void 0 ? void 0 : _a[0];
    // If file is not present and optional, skip upload
    if (!file) {
        if (optional) {
            return undefined;
        }
        return next(new ErrorResponse_1.default(`No file uploaded for field "${fieldName}"`, 400));
    }
    const fileExtension = file.originalname.split(".").pop();
    const s3Params = {
        Bucket: config_1.default.aws.s3Bucket,
        Key: `${folder}/${(0, uuid_1.v4)()}.${fileExtension}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    try {
        const uploadResult = yield s3_1.s3.upload(s3Params).promise();
        return uploadResult.Location;
    }
    catch (error) {
        console.error("Error uploading file to S3:", error);
        return next(new ErrorResponse_1.default("Error uploading file", 500));
    }
});
exports.uploadFileFromFields = uploadFileFromFields;
// @todo: Optimize Images
// export const uploadFile = async (
//   req: FileRequest,
//   next: NextFunction,
//   folder: string,
//   optional: boolean = false
// ) => {
//   const file = req.file;
//   if (!file) {
//     if (optional) return null;
//     return next(new ErrorResponse("No file uploaded", 400));
//   }
//   const isImage = file.mimetype.startsWith("image/");
//   const extension = isImage
//     ? "jpeg"
//     : getExtensionFromMimeType(file.mimetype) ||
//       file.originalname.split(".").pop();
//   const fileKey = `${folder}/${uuidv4()}.${extension}`;
//   const bucket = config.aws.s3Bucket;
//   if (!bucket) {
//     return next(new ErrorResponse("S3 bucket is not configured", 500));
//   }
//   try {
//     const bufferToUpload = isImage
//       ? await sharp(file.buffer)
//           .rotate()
//           .resize({ width: 1280, withoutEnlargement: true })
//           .toFormat("jpeg", { quality: 80, progressive: true })
//           .toBuffer()
//       : file.buffer;
//     const contentType = isImage ? "image/jpeg" : file.mimetype;
//     const uploadResult = await s3
//       .upload({
//         Bucket: bucket,
//         Key: fileKey,
//         Body: bufferToUpload,
//         ContentType: contentType,
//       })
//       .promise();
//     return uploadResult.Location;
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     return next(new ErrorResponse("Error uploading file", 500));
//   }
// };
// export const uploadFileFromFields = async (
//   req: Request,
//   next: NextFunction,
//   folder: string,
//   fieldName: string,
//   optional: boolean = false
// ) => {
//   const files = req.files;
//   if (!files || typeof files !== "object" || Array.isArray(files)) {
//     if (optional) {
//       return undefined;
//     }
//     next(
//       new ErrorResponse(`Invalid file format for field "${fieldName}"`, 400)
//     );
//     return undefined;
//   }
//   const file = files?.[fieldName]?.[0];
//   if (!file) {
//     if (optional) return undefined;
//     return next(
//       new ErrorResponse(`No file uploaded for field "${fieldName}"`, 400)
//     );
//   }
//   const isImage = file.mimetype.startsWith("image/");
//   const extension = isImage
//     ? "jpeg"
//     : getExtensionFromMimeType(file.mimetype) ||
//       file.originalname.split(".").pop();
//   const fileKey = `${folder}/${uuidv4()}.${extension}`;
//   const bucket = config.aws.s3Bucket;
//   if (!bucket) {
//     return next(new ErrorResponse("S3 bucket is not configured", 500));
//   }
//   try {
//     const bufferToUpload = isImage
//       ? await sharp(file.buffer)
//           .rotate()
//           .resize({ width: 1280, withoutEnlargement: true })
//           .toFormat("jpeg", { quality: 80, progressive: true })
//           .toBuffer()
//       : file.buffer;
//     const contentType = isImage ? "image/jpeg" : file.mimetype;
//     const uploadResult = await s3
//       .upload({
//         Bucket: bucket,
//         Key: fileKey,
//         Body: bufferToUpload,
//         ContentType: contentType,
//       })
//       .promise();
//     return uploadResult.Location;
//   } catch (error) {
//     console.error("Error uploading file to S3:", error);
//     return next(new ErrorResponse("Error uploading file", 500));
//   }
// };
// export const uploadMultipleFilesFromFields = async (
//   req: Request,
//   next: NextFunction,
//   folder: string,
//   fieldName: string,
//   optional: boolean = false
// ): Promise<string[] | undefined> => {
//   const files = req.files;
//   console.log("files", files);
//   // Validate the files object
//   if (!files || typeof files !== "object" || Array.isArray(files)) {
//     if (optional) {
//       return undefined;
//     }
//     next(new ErrorResponse(`Invalid file format for field "${fieldName}"`, 400));
//     return undefined;
//   }
//   const fileList = files[fieldName];
//   // If no files and optional, skip
//   if (!fileList || !Array.isArray(fileList) || fileList.length === 0) {
//     if (optional) {
//       return undefined;
//     }
//     next(new ErrorResponse(`No files uploaded for field "${fieldName}"`, 400));
//     return undefined;
//   }
//   const uploadedUrls: string[] = [];
//   try {
//     for (const file of fileList) {
//       const fileExtension = file.originalname.split(".").pop();
//       const s3Params: any = {
//         Bucket: config.aws.s3Bucket,
//         Key: `${folder}/${uuidv4()}.${fileExtension}`,
//         Body: file.buffer,
//         ContentType: file.mimetype,
//       };
//       const uploadResult = await s3.upload(s3Params).promise();
//       uploadedUrls.push(uploadResult.Location);
//     }
//     return uploadedUrls;
//   } catch (error) {
//     console.error("Error uploading multiple files to S3:", error);
//     next(new ErrorResponse("Error uploading multiple files", 500));
//     return undefined;
//   }
// };
function getMimeTypeFromBase64(base64String) {
    const result = base64String.match(/^data:(.+);base64,/);
    return result ? result[1] : "";
}
function getExtensionFromMimeType(mimeType) {
    switch (mimeType) {
        case "audio/mpeg":
            return "mp3";
        case "audio/wav":
            return "wav";
        case "audio/ogg":
            return "ogg";
        case "audio/flac":
            return "flac";
        case "audio/aac":
            return "aac";
        case "application/pdf":
            return "pdf";
        default:
            return "";
    }
}
