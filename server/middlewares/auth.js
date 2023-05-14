const { verifyToken } = require('../helpers/helpers');
const { Admin, Teacher, Student } = require('../models');

const authentification = async (req, res, next) => {
  try {
    const auth_token = req.headers['auth-token'];
    const checkToken = verifyToken(auth_token);
    if (!checkToken) {
      throw new Error('Invalid token');
    }

    const { id, role } = checkToken;

    let userLoginData;

    if (role === 'admin') {
      userLoginData = await Admin.findByPk(id);
    } else if (role === 'teacher') {
      userLoginData = await Teacher.findByPk(id);
    } else if (role === 'student') {
      userLoginData = await Student.findByPk(id);
    }

    if (!userLoginData) {
      throw new Error('Invalid token');
    }

    req.userAccessLogin = {
      id: userLoginData.id,
      role: checkToken.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

const authAdmin = async (req, res, next) => {
  try {
    const { role } = req.userAccessLogin;

    if (role !== 'admin') {
      throw new Error('Not Authorized');
    }

    next();
  } catch (error) {
    next(error);
  }
};
const authStudent = async (req, res, next) => {
  try {
    const { role } = req.userAccessLogin;

    if (role !== 'student') {
      throw new Error('Not Authorized');
    }

    next();
  } catch (error) {
    next(error);
  }
};
const authTeacher = async (req, res, next) => {
  try {
    const { role } = req.userAccessLogin;

    if (role !== 'teacher' && role !== 'admin') {
      throw new Error('Not Authorized');
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authentification, authAdmin, authStudent, authTeacher };
