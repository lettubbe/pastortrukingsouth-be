import express from "express";
import upload from "../middleware/multer";
import { createTextResource, getAllUploadedResources, uploadAudioResource, uploadMediaResource, uploadPhotoResource, uploadVideoResource } from "../controllers/UploadController";

const router = express.Router();

router.get("/", getAllUploadedResources);
router.post("/resource/media", upload.single("media"), uploadMediaResource);
router.post("/resource/audio", upload.single("audio"), uploadAudioResource);
router.post("/resource/text", createTextResource);
router.post("/resource/video", upload.fields([{ name: "thumbnail" }, { name: "video" }]), uploadVideoResource);
router.post("/resource/photos", upload.fields([{ name: "thumbnail" }, { name: "photo" }]), uploadPhotoResource);

export default router;