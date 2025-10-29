import dotenv from "dotenv";

dotenv.config();

const env = process.env.NODE_ENV as string;

const config = {
  env,
  port: process.env.PORT || 5000,
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  mongodb: {
    mongoUri: process.env.MONGO_URI as string,
  },
  aws: {
    region: process.env.AWS_REGION,
    s3Bucket:
      env == "development"
        ? process.env.S3_BUCKET_NAME_STAGING
        : process.env.S3_BUCKET_NAME,
    s3ProductionBucket: process.env.S3_BUCKET_NAME,
    s3StagingBucket: process.env.S3_BUCKET_NAME_STAGING,
    awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
};

export default config;
