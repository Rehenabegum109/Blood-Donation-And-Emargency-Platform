
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import { AuthRoutes } from "./modules/auth/auth.route";
import router from "./routes";


const app: Application = express();
app.use(helmet());
app.use(
	cors({
credentials: true,
	}),
);

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", router);



app.get("/", async (req: Request, res: Response) => {
	
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
