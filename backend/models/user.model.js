import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createOn: {
    type: Date,
    default: Date.now,
  },
});
// Correct way to export the model using ES modules
const User = mongoose.model("User", userSchema);
export default User;
