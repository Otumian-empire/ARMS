import { adminModel as Admin } from "../model/index.js";
import { FORBIDDEN } from "../util/api.message.js";

export default async function AdminAuth(req, res, next) {
  try {
    const payload = req.payload;
    req.payload = undefined;

    const isAuthenticUser = await Admin.findOne({
      id: payload.id,
      username: payload.username,
      email: payload.email
    });

    if (!isAuthenticUser) {
      return res.status(401).json({
        success: false,
        message: FORBIDDEN
      });
    }

    req.id = payload.id;

    return next();
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}
