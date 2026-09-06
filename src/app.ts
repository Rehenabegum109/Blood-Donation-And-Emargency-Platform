
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";

import router from "./routes";
import rateLimit from "express-rate-limit";
import { setupSwagger } from "./docs/swagger";

const app: Application = express();
setupSwagger(app);
app.use(helmet());
app.use(
	cors({
credentials: true,
	}),
);


app.use(express.urlencoded({ extended: true }));


app.use(express.json());
app.use(cookieParser());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || "unknown";
  },
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
    errors: [],
  },
});
app.use("/api/v1", limiter);

app.use("/api/v1", router);



app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "BloodLink API is running",
    data: {
      version: "v1",
      status: "healthy",
    },
  });
});
app.use(notFound);
app.use(globalErrorHandler);


export default app;
