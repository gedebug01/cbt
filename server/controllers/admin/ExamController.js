const { Exam } = require('../../models');

const { v4: uuid } = require('uuid');

class ExamController {
  static async addExamData(req, res, next) {
    try {
      const { time, name } = req.body;
      await Exam.create({
        id: uuid(),
        time,
        name,
      });

      res.status(200).json({ message: 'Berhasil menambahkan ujian' });
    } catch (error) {
      next(error);
    }
  }

  static async editExam(req, res, next) {
    try {
      const id = req.params.id;

      const { grade, name, total_student } = req.body;

      await Exam.update(
        {
          grade,
          name,
          total_student,
        },
        {
          where: { id },
        }
      );
      res.status(200).json({ message: 'Berhasil mengedit ujian' });
    } catch (error) {
      next(error);
    }
  }

  static async deleteExam(req, res, next) {
    try {
      const id = req.params.id;
      await Exam.destroy({
        where: { id },
      });
      res.status(200).json({ message: 'Deleted' });
    } catch (error) {
      next(error);
    }
  }

  static async getListExam(req, res, next) {
    try {
      const allExams = await Exam.findAll();
      res.status(200).json({ class: allExams });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = ExamController;
