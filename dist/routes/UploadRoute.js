"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("../middleware/multer"));
const UploadController_1 = require("../controllers/UploadController");
const router = express_1.default.Router();
router.get("/", UploadController_1.getAllUploadedResources);
router.post("/resource/media", multer_1.default.single("media"), UploadController_1.uploadMediaResource);
router.post("/resource/audio", multer_1.default.single("audio"), UploadController_1.uploadAudioResource);
router.post("/resource/text", UploadController_1.createTextResource);
router.post("/resource/video", multer_1.default.fields([{ name: "thumbnail" }, { name: "video" }]), UploadController_1.uploadVideoResource);
router.post("/resource/photos", multer_1.default.fields([{ name: "thumbnail" }, { name: "photo" }]), UploadController_1.uploadPhotoResource);
exports.default = router;
