const User = require("../model/user.model.js");
const { ErrorCustom } = require("../utils/error.js");
const bcrypt = require("bcrypt");

const GetUser = (req, res) => {
  res.json({ msg: "get user api test !! " });
};

const UpdateUser = async (req, res) => {
  if (req.user.id !== req.params.id)
    return ErrorCustom(401, "you can only upDate your account !!");
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    const UpdateSpecificUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          password: req.body.password,
          name: req.body.userName,
          email: req.body.email,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...rest } = UpdateSpecificUser._doc;
    res.json({ rest });
  } catch (error) {}
  res.json({ msg: "it works" });
};

const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(ErrorCustom(401, "you can only Delete your account !!"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res
      .clearCookie("Access_Token")
      .status(200)
      .json({ msg: "User Has been deleted successfully !!" });
  } catch (error) {
    next(error);
  }
};

const findUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  try {
    const { password: pass, ...data } = user._doc;
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = { GetUser, UpdateUser, deleteUser, findUser };
