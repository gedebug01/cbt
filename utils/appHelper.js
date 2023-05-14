import appPath from '@/constant/appPath';
import * as XLSX from 'xlsx';

export const handleBarTitle = (value, callback) => {
  switch (value) {
    case appPath.admin.dashboard:
      if (callback) callback('Dashboard');
      break;
    case appPath.admin.classList:
      if (callback) callback('Daftar Kelas');
      break;
    case appPath.admin.addClass:
      if (callback) callback('Tambah Kelas');
      break;
    case appPath.admin.teacherList:
      if (callback) callback('Daftar Guru');
      break;
    case appPath.admin.addTeacher:
      if (callback) callback('Tambah Guru');
      break;
    case appPath.admin.studentList:
      if (callback) callback('Daftar Siswa');
      break;
    case appPath.admin.addStudent:
      if (callback) callback('Tambah Siswa');
      break;
    case appPath.admin.createToken:
      if (callback) callback('Tambah Token');
      break;

    case appPath.teacher.addQuestion:
    case appPath.admin.addQuestion:
      if (callback) callback('Tambah Soal Ujian');
      break;
    case appPath.teacher.questionList:
    case appPath.admin.questionList:
      if (callback) callback('List Soal Ujian');
      break;

    case appPath.student.exam:
      if (callback) callback('List Data Ujian');
      break;
    case '/student/examPage':
      if (callback) callback('Halaman Ujian');
      break;
    case '/student/examResult':
      if (callback) callback('Hasil Ujian');
      break;

    default:
      if (callback) callback('Dashboard');
      break;
  }
};

export function genRandonString(length) {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let charLength = chars.length;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charLength));
  }
  return result;
}

export function exportExcel(name, result) {
  const data = result.map((el) => ({
    NIS: el.nis,
    Nisn: el.nisn,
    Nama: el.name,
    Nilai: el.result,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  XLSX.writeFile(workbook, `${name}_data.xlsx`);
}
