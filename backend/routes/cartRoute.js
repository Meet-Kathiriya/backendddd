const express = require("express");
const route = express.Router();
const cartCtl = require("../controllers/cartController");
const userAuth = require("../middlewares/userAuth");

route.get("/", userAuth.checkAuth, cartCtl.getCart);

route.post("/add", userAuth.checkAuth, cartCtl.addToCart);

route.put("/update/:itemId", userAuth.checkAuth, cartCtl.updateCartItem);

route.delete("/remove/:itemId", userAuth.checkAuth, cartCtl.removeFromCart);

route.delete("/clear", userAuth.checkAuth, cartCtl.clearCart);

module.exports = route;

