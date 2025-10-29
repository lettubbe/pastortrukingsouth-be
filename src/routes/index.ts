import express from "express";
import UploadRoute from "./UploadRoute";

const router = express.Router();


// Client App Imports
router.use("/resources", UploadRoute);

export default router;
