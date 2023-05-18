const controllers = require('../controllers');
const apiPath = require('../../constant/apiPath');
const express = require('express');
const { authStudent } = require('../middlewares/auth');
const router = express.Router();

router.use(authStudent);

router.get(
  apiPath.api.student.allQuestion,
  controllers.student.StudentController.getListQuestion
);
router.get(
  apiPath.api.student.profile,
  controllers.student.StudentController.getStudentProfile
);
router.get(
  apiPath.api.student.getResult,
  controllers.student.StudentController.getResult
);
router.get(
  apiPath.api.student.getOneQuestion,
  controllers.student.StudentController.getQuestionById
);
router.post(
  apiPath.api.student.initResult,
  controllers.student.StudentController.initResult
);
router.post(
  apiPath.api.student.collectResult,
  controllers.student.StudentController.collectResult
);

module.exports = router;
