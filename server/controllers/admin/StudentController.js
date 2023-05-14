const { Student, Class } = require('../../models');
const { Op } = require('sequelize');

const { v4: uuid } = require('uuid');
const { hashingPassword } = require('../../helpers/helpers');
const { getPagination, getPagingData } = require('../../helpers/pagination');

class StudentController {
  static async addStudentData(req, res, next) {
    try {
      const { full_name, username, password, class_id, nisn, nis, status } =
        req.body;
      await Student.create({
        id: uuid(),
        username,
        password,
        class_id,
        full_name,
        status,
        nisn,
        nis,
      });

      res.status(200).json({ message: 'berhasil menambahkan siswa' });
    } catch (error) {
      next(error);
    }
  }

  static async bulkCreateStudent(req, res, next) {
    try {
      const body = req?.body?.map((el) => {
        return {
          ...el,
          password: hashingPassword(el.password),
          id: uuid(),
        };
      });

      await Student.bulkCreate(body);

      res.status(200).json({ message: 'berhasil menambahkan siswa' });
    } catch (error) {
      next(error);
    }
  }

  static async editStudent(req, res, next) {
    try {
      const id = req.params.id;
      const { body } = req;

      await Student.update(
        {
          ...body,
        },
        {
          where: { id },
        }
      );
      res.status(200).json({ message: 'berhasil mengedit siswa' });
    } catch (error) {
      next(error);
    }
  }

  static async deleteStudent(req, res, next) {
    try {
      const id = req.params.id;
      await Student.destroy({
        where: { id },
      });
      res.status(200).json({ message: 'Deleted' });
    } catch (error) {
      next(error);
    }
  }

  static async getListStudent(req, res, next) {
    try {
      const { search, page, size } = req.query;

      const { limit, offset } = getPagination(page, size);

      const where = {};

      if (search) {
        where['full_name'] = {
          [Op.startsWith]: `%${search}%`,
        };
      }

      const students = await Student.findAndCountAll({
        limit,
        offset,
        include: [
          {
            model: Class,
            attributes: ['grade', 'name'],
          },
        ],
        order: [['full_name', 'ASC']],
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        where,
      });
      const response = getPagingData(students, page, limit);

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
module.exports = StudentController;
