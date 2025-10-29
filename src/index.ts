import express, { Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/db";
import config from "./config";

import http from "node:http";
import routes from "./routes";
import errorHandler, { notFound } from "./middleware/errors";
import evnError from "./required.env";


// Security: Rate Limiting & Mongo Sanitize
// import hpp from "hpp";
// import helmet from "helmet";
// import mongoSanitize from "express-mongo-sanitize";

const app = express();

// Middleware
// app.use(hpp());
// app.use(helmet());
// app.disable("x-powered-by");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply mongo sanitize
// app.use(mongoSanitize());

// Database Connection
connectDB();


if (evnError.length) {
  console.error(
    `Missing required environment variables: ${evnError.join(", ")}`
  );
  process.exit(1);
}

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send(`letstube Be is Up and Running In ${config.env} mode`);
});

app.use("/api/v1", routes);

// Handle 404 errors
app.use(notFound);

// Error handler middleware
app.use(errorHandler);

const PORT = config.port || 5000;

// Listen on Port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
