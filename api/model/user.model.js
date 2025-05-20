const mongoose = require("mongoose");
const { Schema } = mongoose;
const userModel = new Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/3541/3541871.png",
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userModel);
module.exports = User;
