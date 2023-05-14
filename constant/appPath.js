const appPath = {
  admin: {
    dashboard: '/admin/dashboard',
    classList: '/admin/classList',
    addClass: '/admin/addClass',
    addTeacher: '/admin/addTeacher',
    teacherList: '/admin/teacherList',
    studentList: '/admin/studentList',
    addStudent: '/admin/addStudent',
    library: '/admin/library',
    createExam: '/admin/createExam',
    createToken: '/admin/createToken',
    addQuestion: '/admin/addQuestion',
    questionList: '/admin/questionList',
  },
  teacher: {
    dashboard: '/teacher/dashboard',
    addQuestion: '/teacher/addQuestion',
    questionList: '/teacher/questionList',
    questionResult: '/teacher/questionResult',
  },
  student: {
    dashboard: '/student/dashboard',
    exam: '/student/examList',
    result: '/student/examResult',
  },
};

export default appPath;
