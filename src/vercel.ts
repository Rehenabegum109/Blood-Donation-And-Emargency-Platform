import app from "./app";
import { redisClient } from "./utils/redis";
import { seedAdmin, seedDonor } from "./utils/seed";


if (!redisClient.isOpen) {
  redisClient.connect().catch((error) => {
    console.error("Redis connection error:", error);
  });
}

let seedPromise: Promise<void> | null = null;

const runSeed = async () => {
  await seedAdmin();
  await seedDonor();
};

if (!seedPromise) {
  seedPromise = runSeed().catch((error) => {
    console.error("Seed error:", error);
  });
}

export default app;