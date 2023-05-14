const { Question, Class, Student, Result, sequelize } = require('../../models');
const { Op } = require('sequelize');

const { v4: uuid } = require('uuid');

class StudentController {
  static async getStudentProfile(req, res, next) {
    try {
      const id = req?.userAccessLogin?.id;
      const student = await Student.findOne({
        where: {
          id,
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'password'],
        },
      });

      res.status(200).json({ student });
    } catch (error) {
      next(error);
    }
  }

  static async getListQuestion(req, res, next) {
    try {
      const class_id = req?.params?.class_id;

      const questions = await Question.findAll({
        where: {
          [Op.and]: [{ class_id }, { status: 1 }],
        },
        include: [
          {
            model: Class,
            attributes: ['grade', 'name'],
          },
        ],
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'answer'],
        },
      });

      res.status(200).json({ questions });
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
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'answer'],
        },
      });

      res.status(200).json({ question });
    } catch (error) {
      next(error);
    }
  }

  static async initResult(req, res, next) {
    try {
      const { question_id, start_time } = req.body;
      const student_id = req?.userAccessLogin?.id;
      const result = await Result.create({
        id: uuid(),
        question_id,
        student_id,
        start_time,
        result: null,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async collectResult(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const id = req.params.id;
      const { question_id, answer, end_time, leave_count } = req.body;
      const question = await Question.findOne({
        where: {
          id: question_id,
        },
        attributes: ['answer'],
      });
      const questionAnswer = question.answer;

      let correct = 0;
      let result = 0;

      for (let i = 0; i < questionAnswer.length; i++) {
        if (questionAnswer[i] === answer[i]) {
          correct++;
        }
      }
      result = (correct / questionAnswer.length) * 100;

      await Result.update(
        {
          end_time,
          result,
          answer,
          leave_count,
        },
        {
          where: { id },
        }
      );

      await t.commit();
      res.status(200).json('Hasil dikumpulkan');
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  static async getResult(req, res, next) {
    try {
      const student_id = req?.userAccessLogin?.id;

      const result = await Result.findAll({
        where: {
          student_id,
        },
        include: [
          {
            model: Question,
            attributes: ['id', 'name'],
          },
        ],
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
module.exports = StudentController;
