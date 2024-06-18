import mongoose from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  image: string;
  subscription: string;
}

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  image: String,
  subscription: {
    type: String,
    default: false,
    required: false,
  },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
