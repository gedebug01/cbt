const {
  Admin,
  Teacher,
  Student,
  Token,
  Question,
  Class,
  Result,
} = require('../models');
const {
  comparePassword,
  signToken,
  verifyToken,
} = require('../helpers/helpers.js');

// const nodemailer = require('nodemailer');
const { v4: uuid } = require('uuid');

class Controller {
  static async login(req, res, next) {
    try {
      let user = '';
      const { username, password, role } = req.body;

      if (role === 'admin') {
        user = await Admin.findOne({
          where: {
            username,
          },
        });
      } else if (role === 'teacher') {
        user = await Teacher.findOne({
          where: {
            username,
          },
        });
      } else if (role === 'student') {
        user = await Student.findOne({
          where: {
            username,
          },
        });
      }

      if (!user) {
        throw new Error('Invalid email or password');
      }
      const passwordCheck = comparePassword(password, user.password);

      if (!passwordCheck) {
        throw new Error('Invalid email or password');
      }

      const payload = {
        id: user.id,
        role: role,
      };

      const token = signToken(payload);
      res.status(200).json({
        message: 'User logged in successfully',
        role,
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  // static async register(req, res, next) {
  //   try {
  //     let user = '';

  //     const { username, password, role } = req.body;

  //     if (role === 'admin') {
  //       user = await Admin.create({
  //         username,
  //         password,
  //       });
  //     }

  //     // var transporter = nodemailer.createTransport({
  //     //   service: 'hotmail',
  //     //   auth: {
  //     //     user: 'alizta27@outlook.co.id',
  //     //     pass: 'trythis007',
  //     //   },
  //     // });

  //     // let mailOptions = {
  //     //   from: 'alizta27@outlook.co.id',
  //     //   to: email,
  //     //   subject: 'Sending Email using Nodejs',
  //     //   text: `Akun anda adalah: ${email}, password: ${password}. Tolong jangan bagikan ke orang lain.`,
  //     // };

  //     // transporter.sendMail(mailOptions, (err, info) => {
  //     //   if (err) throw err;
  //     //   console.log('Email sent: ' + info.response);
  //     // });

  //     res.status(201).json({
  //       message: 'User created successfully',
  //       username: user.username,
  //       role: user.role,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  static async getDataByAuth(req, res, next) {
    try {
      const auth_token = req.headers['auth-token'];

      const { role } = verifyToken(auth_token);
      if (!role) {
        throw new Error('Invalid Token');
      }

      res.status(200).json({ message: 'Allready logged in', role });
    } catch (error) {
      next(error);
    }
  }

  static async createToken(req, res, next) {
    try {
      const { expire, secret_token, question_id } = req.body;
      const result = await Token.create({
        id: uuid(),
        expire,
        secret_token,
        question_id,
      });
      res.status(200).json('Berhasil Menambahkan Token');
    } catch (error) {
      next(error);
    }
  }
  static async deleteToken(req, res, next) {
    try {
      const { id } = req.params;
      const token = await Token.destroy({
        where: { id },
      });
      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }
  static async listToken(req, res, next) {
    try {
      const token = await Token.findAll({
        include: [
          {
            model: Question,
            attributes: ['name'],
            include: [
              {
                model: Class,
                attributes: ['name', 'grade'],
              },
            ],
          },
        ],
      });
      res.status(200).json(token);
    } catch (error) {
      next(error);
    }
  }
  static async getOneToken(req, res, next) {
    try {
      const { secret_token } = req.params;
      const token = await Token.findOne({
        where: { secret_token },
      });
      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }

  static async deleteResult(req, res, next) {
    try {
      const id = req.params.id;
      await Result.destroy({
        where: { id },
      });
      res.status(200).json({ message: 'Deleted' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
