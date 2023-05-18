import apiPath from '@/constant/apiPath';
import { PAGE_LIMIT } from '@/constant/appConstant';
import axios from 'axios';
import http from './http';

const base = '/api';

const getRequest = async (path, params) => {
  try {
    return await axios.get(path, params);
  } catch (err) {
    return err;
  }
};

const postRequest = async (path, payload) => {
  try {
    const res = await axios.post(path, payload);
    return res;
  } catch (err) {
    return err;
  }
};

const putRequest = async (path, payload) => {
  try {
    const res = await axios.put(path, payload);
    return res;
  } catch (err) {
    return err;
  }
};

const patchRequest = async (path, payload) => {
  try {
    return await axios.patch(path, payload);
  } catch (err) {
    return err;
  }
};

const deleteRequest = async (path) => {
  try {
    return await axios.delete(path);
  } catch (err) {
    return err;
  }
};

export default {
  auth: {
    login: (payload) => postRequest(base + apiPath.login, payload),
    getAuth: () => http.post(apiPath.getAuth),
  },
  token: {
    getOneToken: (token) => http.get(apiPath.token.getOneToken + '/' + token),
    create: (payload) => http.post(apiPath.token.create, payload),
    delete: (id) => http.delete(apiPath.token.delete + '/' + id),
    list: () => http.get(apiPath.token.list),
  },
  admin: {
    // * ========= Class ============
    addClass: (payload) => http.post(apiPath.admin.addClass, payload),
    bulkAddClass: (payload) => http.post(apiPath.admin.bulkAddClass, payload),
    getAllClass: () => http.get(apiPath.admin.allClass),
    editClass: (id, payload) =>
      http.post(apiPath.admin.editClass + '/' + id, payload),
    deleteClass: (id) => http.delete(apiPath.admin.deleteClass + '/' + id),

    // * ========= student ============
    adminResetStudentLogin: (id) =>
      http.patch(apiPath.admin.adminResetStudentLogin, id),
    resetStudentLogin: () => http.patch(apiPath.admin.resetStudentLogin),
    addStudent: (payload) => http.post(apiPath.admin.addStudent, payload),
    bulkAddStudent: (payload) =>
      http.post(apiPath.admin.bulkAddStudent, payload),
    getAllStudent: (page, limit, search) =>
      http.get(
        `${apiPath.admin.allStudent}?page=${page ?? 0}&size=${
          limit ?? PAGE_LIMIT
        }&search=${search ?? ''}`
      ),
    editStudent: (id, payload) =>
      http.post(apiPath.admin.editStudent + '/' + id, payload),
    deleteStudent: (id) => http.delete(apiPath.admin.deleteStudent + '/' + id),

    // * ========= teacher ============
    addTeacher: (payload) => http.post(apiPath.admin.addTeacher, payload),
    bulkAddTeacher: (payload) =>
      http.post(apiPath.admin.bulkAddTeacher, payload),
    getAllTeacher: (page, limit, search) =>
      http.get(
        `${apiPath.admin.allTeacher}?page=${page ?? 0}&size=${
          limit ?? PAGE_LIMIT
        }&search=${search ?? ''}`
      ),
    editTeacher: (id, payload) =>
      http.post(apiPath.admin.editTeacher + '/' + id, payload),
    deleteTeacher: (id) => http.delete(apiPath.admin.deleteTeacher + '/' + id),

    // * ========= question ============
    getAllQuestion: (params) => http.get(apiPath.admin.allQuestion, { params }),

    // * ========= result ============
    deleteResult: (id) => http.delete(apiPath.admin.deleteResult + '/' + id),
  },
  teacher: {
    addQuestion: (payload) => http.post(apiPath.teacher.addQuestion, payload),
    bulkAddQuestion: (payload) =>
      http.post(apiPath.teacher.bulkAddQuestion, payload),
    getOneQuestion: (id) => http.get(apiPath.teacher.getOneQuestion + '/' + id),
    getAllQuestion: () => http.get(apiPath.teacher.allQuestion),
    editQuestion: (id, payload) =>
      http.post(apiPath.teacher.editQuestion + '/' + id, payload),
    deleteQuestion: (id) =>
      http.delete(apiPath.teacher.deleteQuestion + '/' + id),
    getAllClass: () => http.get(apiPath.teacher.allClass),
    setQuestionStatus: (payload) =>
      http.post(apiPath.teacher.changeStatus, payload),
  },
  student: {
    getResult: (id) => http.get(apiPath.student.getResult),
    getAllQuestion: (id) => http.get(apiPath.student.allQuestion + '/' + id),
    getOneQuestion: (id) => http.get(apiPath.student.getOneQuestion + '/' + id),
    getStudentProfile: () => http.get(apiPath.student.profile),
    initResult: (payload) => http.post(apiPath.student.initResult, payload),
    collectResult: (id, payload) =>
      http.post(apiPath.student.collectResult + '/' + id, payload),
  },
};
