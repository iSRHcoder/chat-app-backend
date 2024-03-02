import User from '../models/userModel.js';

export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select('-password');

    res.status(200).json(filteredUsers);
  } catch (err) {
    console.log('error in getUsersForSideBar controller:', err.message);
    res.status(500).json({
      status: 'failed',
      error: err.message,
      message: 'Internal server error',
    });
  }
};
