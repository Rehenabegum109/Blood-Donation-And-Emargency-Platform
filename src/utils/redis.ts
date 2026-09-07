// import { createClient } from "redis";
// import config from "../config";


// export const redisClient = createClient({
//   username: config.redis_user,
//   password: config.redis_password,
//   socket: {
//     host: config.redis_host,
//     port: Number(config.redis_port),
    
//   },
// });

// redisClient.on("error", (error) => {
//   console.error("Redis Error:", error);
// });


import { createClient } from "redis";
import config from "../config";

export const redisClient = createClient({
  username: config.redis_user,
  password: config.redis_password,
  socket: {
    host: config.redis_host,
    port: Number(config.redis_port),
  },
});

redisClient.on("error", (error) => {
  console.error("Redis Error:", error);
});

let connectPromise: Promise<void> | null = null;

export const ensureRedisConnected = async (): Promise<void> => {
  if (redisClient.isReady) {
    return;
  }

  if (!connectPromise) {
    connectPromise = redisClient
      .connect()
      .then(() => undefined)
      .finally(() => {
        connectPromise = null;
      });
  }

  await connectPromise;
};