import dotenv from "dotenv";

dotenv.config();

const REQUIRED_ENV = [
  "PORT",
  "NODE_ENV",
  "MONGO_URI",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_REGION",
  "S3_BUCKET_NAME",
];

const missingEnv = REQUIRED_ENV.filter((env) => !(env in process.env));

export default missingEnv;
