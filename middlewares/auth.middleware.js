import AppError from "../utility/error.utils.js";
import jwt from "jsonwebtoken";

const isLoggedIn = async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new AppError("Unauthenticated, Please login again", 404));
  }
  const userDetails = await jwt.verify(token, process.env.JWT_SECRET);

  req.user = userDetails;
  next();
};

export default isLoggedIn;
