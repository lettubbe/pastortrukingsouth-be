import { model, Schema } from "mongoose";

const UploadSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

export interface IAuth extends Document {
  type: string;
  mediaUrl: string;
  content: string;
  authorName: string;
  caption: string;
}

const UploadResource = model<IAuth>("resource", UploadSchema);

export default UploadResource;
