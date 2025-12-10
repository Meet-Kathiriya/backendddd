const express = require("express");
const route = express.Router();
const wishlistCtl = require("../controllers/wishlistController");
const userAuth = require("../middlewares/userAuth");

route.get("/", userAuth.checkAuth, wishlistCtl.getWishlist);

route.post("/add", userAuth.checkAuth, wishlistCtl.addToWishlist);

route.delete("/remove/:productId", userAuth.checkAuth, wishlistCtl.removeFromWishlist);

route.delete("/clear", userAuth.checkAuth, wishlistCtl.clearWishlist);

module.exports = route;

