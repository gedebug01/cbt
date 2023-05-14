import appPath from '@/constant/appPath';

export const admin = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    path: appPath.admin.dashboard,
  },
  {
    key: 'class',
    title: 'Data Kelas',
    children: [
      {
        key: 'classList',
        title: 'Daftar Kelas',
        path: appPath.admin.classList,
      },
      {
        key: 'addClass',
        title: 'Tambah Kelas',
        path: appPath.admin.addClass,
      },
    ],
  },
  {
    key: 'student',
    title: 'Data Siswa',
    children: [
      {
        key: 'studentList',
        title: 'Daftar Siswa',
        path: appPath.admin.studentList,
      },
      {
        key: 'addStudent',
        title: 'Tambah Siswa',
        path: appPath.admin.addStudent,
      },
    ],
  },
  {
    key: 'teacher',
    title: 'Data Guru',
    children: [
      {
        key: 'teacherList',
        title: 'Daftar Guru',
        path: appPath.admin.teacherList,
      },
      {
        key: 'addTecher',
        title: 'Tambah Guru',
        path: appPath.admin.addTeacher,
      },
    ],
  },
  {
    key: 'question',
    title: 'Data Soal Ujian',
    children: [
      {
        key: 'quextionList',
        title: 'Daftar Soal Ujian',
        path: appPath.admin.questionList,
      },
      {
        key: 'addQuestion',
        title: 'Tambah Soal Ujian',
        path: appPath.admin.addQuestion,
      },
    ],
  },
  {
    key: 'token',
    title: 'Data Token',
    path: appPath.admin.createToken,
  },
];

export const teacher = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    path: appPath.teacher.dashboard,
  },
  {
    key: 'question',
    title: 'Data Soal Ujian',
    children: [
      {
        key: 'quextionList',
        title: 'Daftar Soal Ujian',
        path: appPath.teacher.questionList,
      },
      {
        key: 'addQuestion',
        title: 'Tambah Soal Ujian',
        path: appPath.teacher.addQuestion,
      },
    ],
  },
];

export const student = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    path: appPath.student.dashboard,
  },
  {
    key: 'exam',
    title: 'Daftar Ujian',
    path: appPath.student.exam,
  },
];
