import jwt from "jsonwebtoken";

import { FORBIDDEN } from "../util/api.message.js";
import { JWT_SECRET, ONE_WEEK } from "../util/app.constant.js";

class Auth {
  static async generateJWT(payload = {}) {
    if (!payload.iat) {
      const JWT_IAT = Date.now() + ONE_WEEK;

      payload.iat = JWT_IAT;
    }

    const jwtToken = jwt.sign(payload, JWT_SECRET);
    return jwtToken;
  }

  static async verifyJWT(token) {
    const { id, username, email, iat } = jwt.verify(token, JWT_SECRET);
    return { id, username, email, hasExpired: hasExpired(iat) };
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

  async hasExpired(ait) {
    return Date.now() > parseInt(ait);
  }
}
