"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const config_1 = __importDefault(require("./config"));
const routes_1 = __importDefault(require("./routes"));
const errors_1 = __importStar(require("./middleware/errors"));
const required_env_1 = __importDefault(require("./required.env"));
// Security: Rate Limiting & Mongo Sanitize
// import hpp from "hpp";
// import helmet from "helmet";
// import mongoSanitize from "express-mongo-sanitize";
const app = (0, express_1.default)();
// Middleware
// app.use(hpp());
// app.use(helmet());
// app.disable("x-powered-by");
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Apply mongo sanitize
// app.use(mongoSanitize());
// Database Connection
(0, db_1.default)();
if (required_env_1.default.length) {
    console.error(`Missing required environment variables: ${required_env_1.default.join(", ")}`);
    process.exit(1);
}
// Routes
app.get("/", (req, res) => {
    res.send(`letstube Be is Up and Running In ${config_1.default.env} mode`);
});
app.use("/api/v1", routes_1.default);
// Handle 404 errors
app.use(errors_1.notFound);
// Error handler middleware
app.use(errors_1.default);
const PORT = config_1.default.port || 5000;
// Listen on Port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
