import express from "express";
import upload from "../middleware/multer";
import { getAllUploadedResources, uploadPhotoResource, uploadVideoResource } from "../controllers/UploadController";

const router = express.Router();

router.get("/", getAllUploadedResources);
router.post("/resource/video", upload.fields([{ name: "thumbnail" }, { name: "video" }]), uploadVideoResource);
router.post("/resource/photos", upload.fields([{ name: "thumbnail" }, { name: "photo" }]), uploadPhotoResource);

export default router;