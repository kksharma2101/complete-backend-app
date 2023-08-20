import express from "express";
import { register } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/register", upload.single("avatar"), register);

export default router;
