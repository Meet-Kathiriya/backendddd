const userSchema = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ msg: "Please fill all fields" });
        }

        let user = await userSchema.findOne({ email: email });

        if (user) {
            return res.status(400).json({ msg: "User already registered" });
        }

        await userSchema.create(req.body).then((data) => {
            let token = jwt.sign({ id: data._id }, process.env.JWT_SECRET || "your_super_secret_jwt_key", { expiresIn: "30d" });
            res.status(200).json({ msg: "User Registered Successfully", data: { _id: data._id, name: data.name, email: data.email }, token: token });
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

module.exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Please fill all fields" });
        }

        let user = await userSchema.findOne({ email: email });

        if (!user) {
            return res.status(401).json({ msg: "User not found" });
        }

        if (await user.comparePassword(password)) {
            let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "your_super_secret_jwt_key", { expiresIn: "30d" });
            return res.status(200).json({ msg: "User logged in successfully", data: { _id: user._id, name: user.name, email: user.email }, token: token });
        } else {
            return res.status(401).json({ msg: "Password is wrong" });
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

module.exports.userProfile = async (req, res) => {
    try {
        await userSchema.findById(req.user._id).then((data) => {
            res.status(200).json({ msg: "Your profile Data", data: data });
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

