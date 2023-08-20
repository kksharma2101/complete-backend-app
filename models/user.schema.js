import { Schema, model } from "mongoose";
import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowerCase: true,
    },
    password: {
      type: String,
      minLength: [8, "password minimum length is 8 character"],
      select: false,
    },
    avatar: {
      public_id: { type: String },
      secure_url: { type: String },
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    subscription: {
      id: String,
      status: String,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  {
    timestamps: true,
  }
);
//
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 8);
});
//
userSchema.methods = {
  generatAuthToken: async function () {
    JWT.sign(
      {
        id: this._id,
        email: this.email,
        subscription: this.subscription,
        role: this.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: 7 * 24 * 60 * 60 * 1000,
      }
    );
  },
  comparePassword: async function (plaintextPassword) {
    return await bcrypt.compare(plaintextPassword, this.password);
  },
};

//
const User = model("User", userSchema);

export default User;
