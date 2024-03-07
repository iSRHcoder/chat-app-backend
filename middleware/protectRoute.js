import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        status: 'failed',
        message: 'Unautharized - No token provided',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        status: 'failed',
        message: 'Unautharized - Invalid token',
      });
    }

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({
        status: 'failed',
        message: 'user not found',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log('Error in protectRoute middleware', err.message);
    res.status(500).json({
      status: 'failed',
      error: err.message,
      message: 'Internal server error',
    });
  }
};

export default protectRoute;
