const User = require("../model/user.model.js");
const bcrypt = require("bcrypt");
const { ErrorCustom } = require("../utils/error.js");
const jwt = require("jsonwebtoken");

const postSignup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hashPassword = bcrypt.hashSync(password, 10);
    const user = new User({ name, email, password: hashPassword });
    await user.save();
    res.status(201).json({ msg: "user has been created successfully" });
  } catch (error) {
    next(error);
  }
};

const postSignin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ValidateteEmail = await User.findOne({ email: email });
    if (!ValidateteEmail) {
      return next(ErrorCustom(401, "uncorrect email !!"));
    }
    const validatePassword = bcrypt.compareSync(
      password,
      ValidateteEmail.password
    );
    if (!validatePassword) {
      return next(ErrorCustom(401, "uncorrect password !! "));
    }
    const { password: pass, ...data } = ValidateteEmail._doc;
    const token = jwt.sign({ id: ValidateteEmail._id }, process.env.TOKEN_CODE);
    res
      .cookie("Access_Token", token, { httpOnly: true })
      .status(200)
      .json(data);
  } catch (error) {
    next(error);
  }
};

const postGoogleSignin = async (req, res, next) => {
  try {
    const { name, email, photo } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.TOKEN_CODE);
      const { password: pass, ...data } = user._doc;
      res
        .cookie("Access_Token", token, { httpOnly: true })
        .status(200)
        .json(data);
    } else {
      const PASSWORD = Math.random().toString(36).slice("-8");
      const passwordbcrypt = bcrypt.hashSync(PASSWORD, 10);
      const newUser = new User({
        name,
        email,
        password: passwordbcrypt,
        avatar: photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.TOKEN_CODE);
      const { password: pass, ...data } = newUser._doc;
      res
        .cookie("Access_Token", token, { httpOnly: true })
        .status(200)
        .json(data);
    }
  } catch (error) {
    next(error);
  }
};

const signOut = (req, res, next) => {
  try {
    res
      .clearCookie("Access_Token")
      .status(200)
      .json({ msg: "the user has been LOGGED OUT !!!" });
  } catch (error) {
    next(error);
  }
};

module.exports = { postSignup, postSignin, postGoogleSignin, signOut };
