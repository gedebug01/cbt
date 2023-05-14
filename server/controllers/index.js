module.exports = {
  admin: {
    ClassControler: require('./admin/ClassController'),
    StudentController: require('./admin/StudentController'),
    TeacherController: require('./admin/TeacherController'),
  },
  teacher: {
    QuestionController: require('./teacher/QuestionController'),
    ClassController: require('./teacher/ClassController'),
  },
  student: {
    StudentController: require('./student/StudentController'),
  },
  DefaultController: require('./Controller'),
};
