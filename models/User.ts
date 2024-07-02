import mongoose from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  image: string;
  customerId: string;
  subscriptionId: string;
}

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  image: String,
  customerId: {
    type: String,
    required: false,
  },
  subscriptionId: {
    type: String,
    required: false,
  },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
