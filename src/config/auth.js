import jwt from "jsonwebtoken";

import { FORBIDDEN, REQUEST_TOKEN } from "../util/api.message.js";
import { JWT_SECRET, ONE_WEEK } from "../util/app.constant.js";

export default class Auth {
  static async generateJWT(payload = {}) {
    const JWT_IAT = Date.now() + ONE_WEEK;
    const jwtToken = jwt.sign({ ...payload, iat: JWT_IAT }, JWT_SECRET);

    return jwtToken;
  }

  static async verifyJWT(token) {
    const { id, username, email, iat } = jwt.verify(token, JWT_SECRET);
    return { id, username, email, hasExpired: await Auth.hasExpired(iat) };
  }

  static async hasBearerToken(req, res, next) {
    const headerAuth = req.headers["authorization"];

    if (!headerAuth) {
      return res.status(403).json({ success: false, message: FORBIDDEN });
    }

    const token = headerAuth.split(" ")[1];

    req.token = token;

    next();
  }

  static async hasExpiredToken(req, res, next) {
    const jwt = req.token;
    req.token = undefined;

    const payload = await Auth.verifyJWT(jwt);

    if (payload.hasExpired) {
      return res.json({ success: false, message: REQUEST_TOKEN });
    }

    req.payload = payload;

    return next();
  }

  static async hasExpired(ait) {
    return Date.now() >= parseInt(ait);
  }
}
