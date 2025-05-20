const express = require("express");
const app = express();
const mongoose = require("mongoose");
const DOTENV = require("dotenv");
const UserRoute = require("./routes/UserRoute.js");
const AuthRoute = require("./routes/AuthRoute.js");
const ListingRoute = require("./routes/ListingRoute.js");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");
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

const dirName = path.resolve();
const frontEndPath = path.join(dirName, "realEstate", "dist");

app.listen(5000, () => {
  console.log("SERVER IS RUNNING  !!");
});

app.use("/api/user", UserRoute);
app.use("/api/auth", AuthRoute);
app.use("/api/listing", ListingRoute);

// app.use(express.static(path.join(dirName, "/realEstate/dist")));
app.use(express.static(frontEndPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(frontEndPath, "index.html"));
});

// app.get("*", (req, res) => {
//   res.sendFile(path.join(dirName, "realEstate", "dist", "index.html"));
// });

// const staticPath = path.join(dirName, "realEstate", "dist");

// if (fs.existsSync(staticPath)) {
//   app.use(express.static(staticPath));
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(staticPath, "index.html"));
//   });
// } else {
//   console.error("Frontend build not found at:", staticPath);
//   // Optional: Only enable in development
//   if (process.env.NODE_ENV === "development") {
//     app.get("*", (req, res) => {
//       res
//         .status(500)
//         .send("Frontend not built - run 'npm run build' in realEstate folder");
//     });
//   }
// }

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
