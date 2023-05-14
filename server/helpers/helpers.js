const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const key = process.env.SECRET_KEY;

const hashingPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

const comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

const signToken = (payload) => {
  return jwt.sign(payload, key);
};

const verifyToken = (token) => {
  return jwt.verify(token, key);
};

module.exports = {
  hashingPassword,
  comparePassword,
  signToken,
  verifyToken,
};
