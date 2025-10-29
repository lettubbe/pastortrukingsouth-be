import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { Request, NextFunction } from "express";
import ErrorResponse from "../../messages/ErrorResponse";
import config from "../../config";
import { s3 } from "./s3";

interface FileRequest extends Request {
  file?: Express.Multer.File;
}

interface FieldsRequest extends Request {
  files?: {
    [fieldname: string]: Express.Multer.File[];
  };
}

export const uploadFile = async (
  req: FileRequest,
  next: NextFunction,
  folder: string,
  optional: boolean = false
) => {
  const file = req.file;

  // console.log("upload file", file);

  // if (!file) {
  //   return next(new ErrorResponse("No file uploaded", 400));
  // }

  if (!file) {
    if (optional) {
      return null;
    }
    return next(new ErrorResponse("No file uploaded", 400));
  }

  // console.log("file", file);

  const fileExtension = file.originalname.split(".").pop();

  const s3Params: any = {
    Bucket: config.aws.s3Bucket,
    Key: `${folder}/${uuidv4()}.${fileExtension}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const uploadResult = await s3.upload(s3Params).promise();
    return uploadResult.Location;
  } catch (error) {
    console.log("error uploading profile picture", error);
    return next(new ErrorResponse("Error uploading file", 500));
  }
};

export const uploadMultipleFilesFromFields = async (
  req: Request,
  next: NextFunction,
  folder: string,
  fieldName: string,
  optional: boolean = false
): Promise<string[] | undefined> => {
  const files = req.files;

  console.log("files", files);

  // Validate the files object
  if (!files || typeof files !== "object" || Array.isArray(files)) {
    if (optional) {
      return undefined;
    }
    next(new ErrorResponse(`Invalid file format for field "${fieldName}"`, 400));
    return undefined;
  }

  const fileList = files[fieldName];

  // If no files and optional, skip
  if (!fileList || !Array.isArray(fileList) || fileList.length === 0) {
    if (optional) {
      return undefined;
    }
    next(new ErrorResponse(`No files uploaded for field "${fieldName}"`, 400));
    return undefined;
  }

  const uploadedUrls: string[] = [];

  try {
    for (const file of fileList) {
      const fileExtension = file.originalname.split(".").pop();

      const s3Params: any = {
        Bucket: config.aws.s3Bucket,
        Key: `${folder}/${uuidv4()}.${fileExtension}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const uploadResult = await s3.upload(s3Params).promise();
      uploadedUrls.push(uploadResult.Location);
    }

    return uploadedUrls;
  } catch (error) {
    console.error("Error uploading multiple files to S3:", error);
    next(new ErrorResponse("Error uploading multiple files", 500));
    return undefined;
  }
};

export const uploadFileFromFields = async (
  req: Request,
  next: NextFunction,
  folder: string,
  fieldName: string,
  optional: boolean = false
) => {
  const files = req.files;

  console.log("files", files);

  // Validate the files object
  if (!files || typeof files !== "object" || Array.isArray(files)) {
    if (optional) {
      return undefined;
    }
    next(new ErrorResponse(`Invalid file format for field "${fieldName}"`, 400));
    return undefined;
  }

  const file = files[fieldName]?.[0];

  // If file is not present and optional, skip upload
  if (!file) {
    if (optional) {
      return undefined;
    }
    return next(new ErrorResponse(`No file uploaded for field "${fieldName}"`, 400));
  }

  const fileExtension = file.originalname.split(".").pop();

  const s3Params: any = {
    Bucket: config.aws.s3Bucket,
    Key: `${folder}/${uuidv4()}.${fileExtension}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const uploadResult = await s3.upload(s3Params).promise();
    return uploadResult.Location;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    return next(new ErrorResponse("Error uploading file", 500));
  }
};


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


export function getMimeTypeFromBase64(base64String: string): string {
  const result = base64String.match(/^data:(.+);base64,/);
  return result ? result[1] : "";
}

export function getExtensionFromMimeType(mimeType: string): string {
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
