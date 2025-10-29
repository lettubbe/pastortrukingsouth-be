"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UploadRoute_1 = __importDefault(require("./UploadRoute"));
const router = express_1.default.Router();
// Client App Imports
router.use("/resources", UploadRoute_1.default);
exports.default = router;
