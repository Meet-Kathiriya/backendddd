const jwt = require("jsonwebtoken");
const userSchema = require("../models/userSchema");

module.exports.checkAuth = async (req, res, next) => {
    let token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ msg: "Token not found" });
    }

    let newToken = token.slice(7, token.length);

    try {
        let decode = jwt.verify(newToken, process.env.JWT_SECRET || "your_super_secret_jwt_key");

        let user = await userSchema.findById(decode.id);

        if (!user) {
            return res.status(401).json({ msg: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ msg: "Invalid token" });
    }
};

