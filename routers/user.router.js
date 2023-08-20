import express from "express";
import {
  getProfile,
  logIn,
  logOut,
  register,
} from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import isLoggedIn from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", upload.single("avatar"), register);
router.post("/login", logIn);
router.get("/logout", logOut);
router.get("/me", isLoggedIn, getProfile);

export default router;
