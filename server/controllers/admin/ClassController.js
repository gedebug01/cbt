const { Class } = require('../../models');

const { v4: uuid } = require('uuid');

class ClassController {
  static async addClassData(req, res, next) {
    try {
      const { grade, name, total_student } = req.body;
      await Class.create({
        id: uuid(),
        grade,
        name,
        total_student,
      });

      res.status(200).json({ message: 'Berhasil menambahkan kelas' });
    } catch (error) {
      next(error);
    }
  }

  static async bulkCreateClass(req, res, next) {
    try {
      const body = req?.body?.map((el) => {
        return {
          ...el,
          id: uuid(),
        };
      });

      await Class.bulkCreate(body);

      res.status(200).json({ message: 'Berhasil menambahkan kelas' });
    } catch (error) {
      next(error);
    }
  }

  static async editClass(req, res, next) {
    try {
      const id = req.params.id;

      const { grade, name, total_student } = req.body;

      await Class.update(
        {
          grade,
          name,
          total_student,
        },
        {
          where: { id },
        }
      );
      res.status(200).json({ message: 'Berhasil mengedit kelas' });
    } catch (error) {
      next(error);
    }
  }

  static async deleteClass(req, res, next) {
    try {
      const id = req.params.id;
      await Class.destroy({
        where: { id },
      });
      res.status(200).json({ message: 'Deleted' });
    } catch (error) {
      next(error);
    }
  }

  static async getListClass(req, res, next) {
    try {
      const allClass = await Class.findAll();
      res.status(200).json({ class: allClass });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = ClassController;
