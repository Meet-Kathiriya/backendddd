const mongoose = require("mongoose");

const buildAtlasUri = () => {
    if (process.env.MONGODB_URI) return process.env.MONGODB_URI;

    const user = process.env.DB_USER || "zyxcab101819_db_user";
    const password = process.env.DB_PASSWORD;
    const host = process.env.DB_HOST || "websites.lvxthbm.mongodb.net";
    const appName = process.env.DB_APP_NAME || "Websites";

    if (!password) {
        console.warn(
            "WARNING: No DB_PASSWORD found in environment. Falling back to local MongoDB."
        );
        return "mongodb://localhost:27017/craftcore";
    }

    return `mongodb+srv://${user}:${encodeURIComponent(password)}@${host}/?appName=${appName}`;
};

const uri = buildAtlasUri();

mongoose
    .connect(uri)
    .then(() => console.log("Db connected successfully (MongoDB Atlas / configured URI)"))
    .catch((err) => console.error("Db connection error:", err));

module.exports = mongoose.connection;
