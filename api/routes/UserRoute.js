const express = require("express");
const UserRoute = express.Router();
const {
  GetUser,
  UpdateUser,
  deleteUser,
  findUser,
} = require("../controllers/UserFunc.js");
const { VerifyUser } = require("../utils/VerifyUser.js");

UserRoute.get("/test", GetUser);
UserRoute.post("/updateUser/:id", VerifyUser, UpdateUser);
UserRoute.delete("/deleteUser/:id", VerifyUser, deleteUser);
UserRoute.get("/:id", findUser);

module.exports = UserRoute;
