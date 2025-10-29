import AWS from "aws-sdk";
import config from "../../config";

export const s3 = new AWS.S3({
  accessKeyId: config.aws.awsAccessKey,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region,
});

export const S3_BUCKET_NAME = config.aws.s3Bucket;

export const uploadParams = (fileName: string, buffer: string, mimeType: string) => {
  const params = {
    Bucket: S3_BUCKET_NAME as string,
    Key: fileName,
    Body: buffer,
    ContentType: mimeType,
  };

  return params;
}

export const generatePresignedUrl = async (imagePath: string) => {

    const params = {
        Bucket: S3_BUCKET_NAME,
        Key: imagePath,
        Expires: 120
    }

    const uploadUrl = await s3.getSignedUrlPromise("putObject", params);

    return uploadUrl;

}