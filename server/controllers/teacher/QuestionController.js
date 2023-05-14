const { Question, Class, Result, Student } = require('../../models');
const { Op } = require('sequelize');
const { v4: uuid } = require('uuid');

class QuestionControler {
  static async addQuestionData(req, res, next) {
    try {
      const { question_link, answer, class_id, name, duration, teacher_id } =
        req.body;
      const teacher = req?.userAccessLogin?.id;
      await Question.create({
        status: 2,
        id: uuid(),
        question_link,
        answer,
        teacher_id: teacher_id ?? teacher,
        class_id,
        name,
        duration,
      });

      res.status(200).json({ message: 'Berhasil menambahkan soal' });
    } catch (error) {
      next(error);
    }
  }

  static async bulkCreateQuestion(req, res, next) {
    try {
      const teacher_id = req?.userAccessLogin?.id;
      const body = req?.body?.map((el) => {
        return {
          ...el,
          teacher_id: el.teacher_id ?? teacher_id,
          status: 2,
          id: uuid(),
        };
      });

      await Question.bulkCreate(body);

      res.status(200).json({ message: 'Berhasil menambahkan soal' });
    } catch (error) {
      next(error);
    }
  }

  static async editQuestion(req, res, next) {
    try {
      const id = req.params.id;
      const { body } = req;

      await Question.update(
        {
          ...body,
        },
        {
          where: { id },
        }
      );
      res.status(200).json({ message: 'Berhasil mengedit soal' });
    } catch (error) {
      next(error);
    }
  }

  static async deleteQuestion(req, res, next) {
    try {
      const id = req.params.id;
      await Question.destroy({
        where: { id },
      });
      res.status(200).json({ message: 'Deleted' });
    } catch (error) {
      next(error);
    }
  }

  static async getListQuestion(req, res, next) {
    try {
      const teacher_id = req?.userAccessLogin?.id;

      const questions = await Question.findAll({
        where: {
          teacher_id,
        },
        include: [
          {
            model: Class,
            attributes: ['grade', 'name'],
          },
        ],
      });

      res.status(200).json({ questions });
    } catch (error) {
      next(error);
    }
  }

  static async getAllListQuestion(req, res, next) {
    try {
      const { status, class_id } = req.query;
      let where = {};

      if (class_id) {
        where = {
          class_id,
        };
      }

      if (status) {
        where = { [Op.and]: [class_id ? { class_id } : {}, { status }] };
      }
      const questions = await Question.findAll({
        where,
        include: [
          {
            model: Class,
            attributes: ['grade', 'name'],
          },
        ],
      });

      res.status(200).json({ questions });
    } catch (error) {
      next(error);
    }
  }

  static async setQuestionStatus(req, res, next) {
    try {
      const { status, id } = req.body;
      await Question.update(
        {
          status: status,
        },
        {
          where: { id },
        }
      );
      res.status(200).json({ message: 'Berhasil mengupdate status' });
    } catch (error) {
      next(error);
    }
  }

  static async getQuestionById(req, res, next) {
    try {
      const id = req?.params?.id;
      const question = await Question.findOne({
        where: {
          id,
        },
        include: [
          {
            model: Result,
            attributes: ['id', 'result', 'answer', 'leave_count'],
            include: {
              model: Student,
              attributes: ['full_name', 'nisn', 'nis'],
            },
          },
        ],
        attributes: ['name', 'answer'],
      });

      res.status(200).json({ question });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = QuestionControler;
