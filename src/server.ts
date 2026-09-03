import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";
import { redisClient } from "./utils/redis";


const PORT = Number(config.port) || 5000;

const startServer = async () => {
  try {


    await prisma.$connect();

    console.log("Database connected");

   

   await redisClient.connect();

    console.log(" Redis connected");


    app.listen(PORT, () => {
      console.log(
        `🚀 BloodLink server running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(" Failed to start server:", error);

    await prisma.$disconnect();

    process.exit(1);
  }
};

startServer();