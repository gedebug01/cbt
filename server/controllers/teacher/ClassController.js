const { Class } = require('../../models');

const { v4: uuid } = require('uuid');

class ClassController {
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
