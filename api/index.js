const express = require("express");
const app = express();
const mongoose = require("mongoose");
const DOTENV = require("dotenv");
const UserRoute = require("./routes/UserRoute.js");
const AuthRoute = require("./routes/AuthRoute.js");
const ListingRoute = require("./routes/ListingRoute.js");
const cookieParser = require("cookie-parser");
const path = require("path");
DOTENV.config();
app.use(express.json());
app.use(cookieParser());
mongoose
  .connect(process.env.MONGOURL)
  .then(() => {
    console.log("DATABASE CONNECTED !!");
  })
  .catch((error) => {
    console.log(error);
  });

const dirName = path.resolve(__dirname);

app.listen(5000, () => {
  console.log("SERVER IS RUNNING  !!");
});

app.use("/api/user", UserRoute);
app.use("/api/auth", AuthRoute);
app.use("/api/listing", ListingRoute);

app.use(express.static(path.join(dirName, "realEstate", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(dirName, "realEstate", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
