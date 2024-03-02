import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'fullName is a required Field'],
    },
    userName: {
      type: String,
      required: [true, 'userName is a required Field'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'password is a required Field'],
    },
    confirmPassword: {
      type: String,
    },
    gender: {
      type: String,
      required: [true, 'gender is a required Field'],
      enum: ['male', 'female'],
    },
    profilePic: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema);

export default User;
