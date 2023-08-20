import User from "../models/user.schema.js";
import { v2 as cloudinary } from "cloudinary";
import AppError from "../utility/error.utils.js";

//
const cookiOption = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
};
//
const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!(name, email, password)) {
    return next(new AppError("All field is mandatory"), 402);
  }
  //
  const exists = await User.findOne({ email });
  if (exists) {
    return next(new AppError("Email already exists", 404));
  }
  //
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: email,
      secure_url:
        "https://th.bing.com/th/id/OIP.dBFaFiqefx7PRptPkOljCwHaLS?&rs=1&pid=ImgDet",
    },
  });
  if (!user) {
    return next(new AppError("User create not success", 405));
  }
  // set cloudinary

  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
        width: 100,
        height: 100,
        crop: "fill",
      });
      if (result) {
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;
      }
    } catch (e) {
      return next(new AppError("File not uploaded, please try again", 404));
    }
  }

  //
  await user.save();
  user.password = undefined;
  //
  const token = user.generatAuthToken();

  res.cookie("token", token, cookiOption);
  //
  res.status(200).json({
    success: true,
    message: "User registration successfully",
    user,
  });
};

//logIn controllers
const logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!(email, password)) {
      return next(new AppError("All feild require"));
    }
    //
    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.comparePassword(password)) {
      return next(
        new AppError("Email and Password dose not match, Please try again", 404)
      );
    }
    user.password = undefined;
    //
    const token = await user.generatAuthToken();
    res.cookie("token", token, cookiOption);

    //
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
    });
  } catch (e) {
    return next(new AppError(e.message, 404));
  }
};

//logOut controllers
const logOut = async (req, res) => {
  res.cookie("token", null, {
    success: true,
    maxAge: 0,
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};

// getProfile controllers
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    res.status(200).json({
      success: true,
      message: "User details",
      user,
    });
  } catch (e) {
    return next(new AppError("Faild to fetch profile details", 405));
  }
};

//
export { register, logIn, logOut, getProfile };
