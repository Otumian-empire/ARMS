// const { User } = require("../model");

const { UNAUTHORIZED } = require("../util/api.message");

module.exports = async (req, res, next) => {
    try {
        const { id, email } = req.payload;
        req.payload = undefined;

        const isAuthenticUser = await User.findOne({ id, email });

        if (!isAuthenticUser) {
            return res.status(401).json({ success: false, message: UNAUTHORIZED });
        }

        req.id = id;

        return next();
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};