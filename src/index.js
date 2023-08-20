import connectToDb from "../config/db.config.js";
import app from "./app.js";
import { v2 as cloudinary } from "cloudinary";

const PORT = process.env.PORT || 5000;

cloudinary.config = {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
};

app.listen(PORT, async () => {
  //
  connectToDb();
  //
  console.log(`Server is running on ${PORT}`);
});
