import app from "./app";
import { redisClient } from "./utils/redis";

if (!redisClient.isOpen) {
  redisClient.connect().catch((error) => {
    console.error("Redis connection error:", error);
  });
}

export default app;