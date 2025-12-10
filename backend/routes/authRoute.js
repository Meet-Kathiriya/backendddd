const express = require("express");
const route = express.Router();
const authCtl = require("../controllers/authController");
const userAuth = require("../middlewares/userAuth");

route.post("/register", authCtl.userRegister);

route.post("/login", authCtl.userLogin);

route.get("/profile", userAuth.checkAuth, authCtl.userProfile);

module.exports = route;

