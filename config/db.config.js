import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const connectToDb = async (req, res) => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    if (connect) {
      console.log("DB connect successfully");
    }
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

export default connectToDb;
