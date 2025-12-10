const express = require("express");
const route = express.Router();
const productCtl = require("../controllers/productController");
const userAuth = require("../middlewares/userAuth");

route.get("/", productCtl.getAllProducts);

route.get("/:id", productCtl.getProductById);

route.post("/", userAuth.checkAuth, productCtl.createProduct);

route.put("/:id", userAuth.checkAuth, productCtl.updateProduct);

route.delete("/:id", userAuth.checkAuth, productCtl.deleteProduct);

module.exports = route;

