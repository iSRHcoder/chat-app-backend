import User from '../models/userModel.js';
import bcryptjs from 'bcryptjs';
import generateTokenAndSetCookie from '../utils/generateToken.js';

export const signupUser = async (req, res) => {
  try {
    const { fullName, userName, password, confirmPassword, gender } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 'failed',
        message: 'password and confirm password should match',
      });
    }

    const user = await User.findOne({ userName });

    if (user) {
      return res.status(400).json({
        status: 'failed',
        message: `${user} already exist, please use different userName`,
      });
    }

    //Hash password;
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    //Avatar selector;
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${userName}`;

    const newUser = new User({
      fullName,
      userName,
      password: hashedPassword,
      gender,
      profilePic: gender === 'male' ? boyProfilePic : girlProfilePic,
    });

    if (newUser) {
      //generate token
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        userName: newUser.userName,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({
        status: 'failed',
        message: `Invalid user data`,
      });
    }
  } catch (err) {
    console.log('error in signup controller');
    res.status(500).json({
      status: 'failed',
      error: `error in signup controller`,
      message: err.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    const isPasswordIsCorrect = await bcryptjs.compare(
      password,
      user?.password || '',
    );

    if (!user || !isPasswordIsCorrect) {
      return res.status(400).json({
        status: 'failed',
        message: 'Invalid userName or password',
      });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.log('error in login controller');
    res.status(500).json({
      status: 'failed',
      error: `error in login controller`,
      message: err.message,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({
      status: 'success',
      message: 'logged out successfully',
    });
  } catch (err) {
    console.log('error in logout controller');
    res.status(500).json({
      status: 'failed',
      error: `error in logout controller`,
      message: err.message,
    });
  }
};
