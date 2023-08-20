import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookie from "cookie-parser";
import router from "../routers/user.router.js";
// import errorMiddleware from "../middlewares/error.middleware.js";

const app = express();
//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("start"));
app.use(cookie());
app.use(cors({}));
//
app.use("/user/v1", router);
//
app.all("*", (req, res) => {
  res.status(404).send("OOPS 404 page not found");
});
//
// errorMiddleware();
//
export default app;
