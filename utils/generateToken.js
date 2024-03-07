import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userId, res) => {
  console.log('process.env.jwt_SECRET', process.env.jwt_SECRET);
  const token = jwt.sign({ userId }, process.env.jwt_SECRET, {
    expiresIn: '15d',
  });
  res.cookie('jwt', token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, //should be in milliSeconds
    httpOnly: true, //prevent XSS attacks cross-site scripting attacks
    sameSite: 'strict', // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV === 'development' ? true : false,
  });
};

export default generateTokenAndSetCookie;
