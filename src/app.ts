
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";

import router from "./routes";
import rateLimit from "express-rate-limit";

const app: Application = express();

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
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
    errors: [],
  },
});
app.use("/api/v1", limiter);

app.use("/api/v1", router);



app.get("/", async (req: Request, res: Response) => {
	
});
app.use(notFound);
app.use(globalErrorHandler);


export default app;
