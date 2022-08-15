import redis from "redis";

import { REDIS_URI } from "../util/app.constant.js";
import logger from "../config/logger.js";

const client = redis.createClient({ url: REDIS_URI });

client.on("error", (error) => logger.error(error.message));

client.on("connect", () => {
  logger.info("Redis server connected");
});

client.on("end", () => {
  logger.info("Redis server disconnected");
});

client.on("reconnecting", () => {
  logger.info("Redis server reconnecting");
});

await client.connect();

export default client;
