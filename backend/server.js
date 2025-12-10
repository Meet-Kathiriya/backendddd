const express = require("express");
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;

const app = express();
const db = require("./config/db");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({ msg: "CraftCore API is running" });
});

app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/products", require("./routes/productRoute"));
app.use("/api/cart", require("./routes/cartRoute"));
app.use("/api/wishlist", require("./routes/wishlistRoute"));
app.use("/api/payment", require("./routes/paymentRoute"));

app.listen(port, (err) => {
    err ? console.log(err) : console.log(`Server started on port ${port}`);
});
