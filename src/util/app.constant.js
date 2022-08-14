import dotenv from "dotenv";
dotenv.config();

export const rounds = parseInt(process.env.SALT_ROUNDS) || 10;
export const JWT_SECRET = process.env.JWT_SECRET;
export const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;
export const MONGODB_URI = process.env.MONGODB_URI;
export const port = process.env.PORT || 3000;
export const MINIMUM_PASSWORD_SIZE = 6;
export const ONE = 1;
export const ONE_WEEK = 1000 * 60 * 3; /* 60 * 24 * 7 */
export const PAGINATION = { page: 1, pageSize: 12 };
export const REDIS_URI = process.env.REDIS_URI;
