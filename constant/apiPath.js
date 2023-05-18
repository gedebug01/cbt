const apiPath = {
  root: '/',
  login: '/login',
  register: '/register',
  getAuth: '/getAuth',
  token: {
    getOneToken: '/token/getOneToken',
    create: '/token/create',
    delete: '/token/delete',
    list: '/token/list',
  },
  admin: {
    addClass: '/admin/add-class',
    bulkAddClass: '/admin/bulk-add-class',
    allClass: '/admin/all-class',
    editClass: '/admin/edit-class',
    deleteClass: 'admin/delete-class',

    addStudent: '/admin/add-student',
    bulkAddStudent: '/admin/bulk-add-student',
    allStudent: '/admin/all-student',
    editStudent: '/admin/edit-student',
    deleteStudent: '/admin/delete-student',
    resetStudentLogin: '/admin/reset-student-login',
    adminResetStudentLogin: '/admin/admin-reset-student-login',

    addTeacher: '/admin/add-teacher',
    bulkAddTeacher: '/admin/bulk-add-teacher',
    allTeacher: '/admin/all-teacher',
    editTeacher: '/admin/edit-teacher',
    deleteTeacher: '/admin/delete-teacher',

    allQuestion: '/admin/all-question',
    deleteResult: '/admin/delete-result',
  },

  teacher: {
    getOneQuestion: '/teacher/one-question',
    allQuestion: '/teacher/all-question',
    allClass: '/teacher/all-class',
    addQuestion: 'teacher/add-question',
    bulkAddQuestion: 'teacher/bulk-add-question',
    editQuestion: '/teacher/edit-question',
    deleteQuestion: '/teacher/delete-question',
    changeStatus: '/teacher/change-status',
  },
  student: {
    allQuestion: '/student/all-question',
    profile: '/student/profile',
    getOneQuestion: '/student/one-question',
    initResult: '/student/init-result',
    collectResult: '/student/collect-result',
    getResult: '/student/get-result',
  },

  api: {
    token: {
      create: '/create',
      delete: '/delete/:id',
      list: '/list',
      getOneToken: '/getOneToken/:secret_token',
    },
    admin: {
      addClass: '/add-class',
      bulkAddClass: '/bulk-add-class',
      allClass: '/all-class',
      editClass: '/edit-class/:id',
      deleteClass: '/delete-class/:id',

      addStudent: '/add-student',
      bulkAddStudent: '/bulk-add-student',
      allStudent: '/all-student',
      editStudent: '/edit-student/:id',
      deleteStudent: '/delete-student/:id',
      resetStudentLogin: '/reset-student-login',
      adminResetStudentLogin: '/admin-reset-student-login',

      addTeacher: '/add-teacher',
      bulkAddTeacher: '/bulk-add-teacher',
      allTeacher: '/all-teacher',
      editTeacher: '/edit-teacher/:id',
      deleteTeacher: '/delete-teacher/:id',

      allQuestion: '/all-question',
      deleteResult: '/delete-result/:id',
    },

    teacher: {
      getOneQuestion: '/one-question/:id',
      allQuestion: '/all-question',
      allClass: '/all-class',
      addQuestion: '/add-question',
      bulkAddQuestion: '/bulk-add-question',
      editQuestion: '/edit-question/:id',
      deleteQuestion: '/delete-question/:id',
      changeStatus: '/change-status',
    },
    student: {
      allQuestion: '/all-question/:class_id',
      getOneQuestion: '/one-question/:id',
      profile: '/profile',
      initResult: '/init-result',
      collectResult: '/collect-result/:id',
      getResult: '/get-result',
    },
  },
};
// export default apiPath;
module.exports = apiPath;
