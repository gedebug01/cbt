const controllers = require('../controllers');
const apiPath = require('../../constant/apiPath');
const express = require('express');
const { authAdmin } = require('../middlewares/auth');
const router = express.Router();

//* ================== class ==========
router.get(
  apiPath.api.admin.allClass,
  controllers.admin.ClassControler.getListClass
);

router.use(authAdmin);

router.post(
  apiPath.api.admin.addClass,
  controllers.admin.ClassControler.addClassData
);
router.post(
  apiPath.api.admin.bulkAddClass,
  controllers.admin.ClassControler.bulkCreateClass
);
router.post(
  apiPath.api.admin.editClass,
  controllers.admin.ClassControler.editClass
);
router.delete(
  apiPath.api.admin.deleteClass,
  controllers.admin.ClassControler.deleteClass
);

//* ================== students ==========
router.get(
  apiPath.api.admin.allStudent,
  controllers.admin.StudentController.getListStudent
);
router.post(
  apiPath.api.admin.addStudent,
  controllers.admin.StudentController.addStudentData
);
router.post(
  apiPath.api.admin.bulkAddStudent,
  controllers.admin.StudentController.bulkCreateStudent
);
router.post(
  apiPath.api.admin.editStudent,
  controllers.admin.StudentController.editStudent
);
router.delete(
  apiPath.api.admin.deleteStudent,
  controllers.admin.StudentController.deleteStudent
);

//* ================== teacher ==========
router.get(
  apiPath.api.admin.allTeacher,
  controllers.admin.TeacherController.getListTeacher
);
router.post(
  apiPath.api.admin.addTeacher,
  controllers.admin.TeacherController.addTeacherData
);
router.post(
  apiPath.api.admin.bulkAddTeacher,
  controllers.admin.TeacherController.bulkCreateTeacher
);
router.post(
  apiPath.api.admin.editTeacher,
  controllers.admin.TeacherController.editTeacher
);
router.delete(
  apiPath.api.admin.deleteTeacher,
  controllers.admin.TeacherController.deleteTeacher
);

// * ========== Question ===========
router.get(
  apiPath.api.admin.allQuestion,
  controllers.teacher.QuestionController.getAllListQuestion
);
// * ========== Result ===========
router.delete(
  apiPath.api.admin.deleteResult,
  controllers.DefaultController.deleteResult
);

module.exports = router;
