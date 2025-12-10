const express = require("express");
const route = express.Router();
const paymentCtl = require("../controllers/paymentController");
const userAuth = require("../middlewares/userAuth");

route.post("/create-payment-intent", userAuth.checkAuth, paymentCtl.createPaymentIntent);
route.post("/confirm-payment", userAuth.checkAuth, paymentCtl.confirmPayment);
route.get("/orders", userAuth.checkAuth, paymentCtl.getUserOrders);
route.get("/orders/:orderId", userAuth.checkAuth, paymentCtl.getOrder);

module.exports = route;

