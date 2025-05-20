const express = require("express");
const AuthRoute = express.Router();
const {
  postSignup,
  postSignin,
  postGoogleSignin,
  signOut,
} = require("../controllers/AuthFunc.js");
AuthRoute.post("/signup", postSignup);
AuthRoute.post("/signin", postSignin);
AuthRoute.post("/google", postGoogleSignin);
AuthRoute.get("/signout", signOut);

module.exports = AuthRoute;
