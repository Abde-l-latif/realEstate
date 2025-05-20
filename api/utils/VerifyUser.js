const { ErrorCustom } = require("./error.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const VerifyUser = (req, res, next) => {
  const token = req.cookies.Access_Token;
  if (!token) {
    return next(ErrorCustom(401, "unAutherized error token !!"));
  }
  jwt.verify(token, process.env.TOKEN_CODE, (error, user) => {
    if (error)
      return next(
        ErrorCustom(
          403,
          "the server understands the request but can't provide additional access"
        )
      );
    req.user = user;
    next();
  });
};

module.exports = { VerifyUser };
