import api from '@/api';
import actionTypes from '@/constant/actionTypes';

export const addQuestion = (payload) => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.IS_LOADING,
      payload: true,
    });
    try {
      const { data, status } = await api.teacher.addQuestion(payload);

      if (status === 200) {
        dispatch({
          type: actionTypes.IS_ERROR,
          payload: null,
        });
        return { data };
      } else {
        dispatch({
          type: actionTypes.IS_ERROR,
          payload: data,
        });
        return { error: data };
      }
    } catch (error) {
      dispatch({
        type: actionTypes.IS_ERROR,
        payload: error.message,
      });
      return { error: error.message };
    } finally {
      dispatch({
        type: actionTypes.IS_LOADING,
        payload: false,
      });
    }
  };
};

export const bulkAddQuestion = (payload) => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.IS_LOADING,
      payload: true,
    });
    try {
      const { data, status } = await api.teacher.bulkAddQuestion(payload);

      if (status === 200) {
        dispatch({
          type: actionTypes.IS_ERROR,
          payload: null,
        });
        return { data };
      } else {
        dispatch({
          type: actionTypes.IS_ERROR,
          payload: data,
        });
        return { error: data };
      }
    } catch (error) {
      dispatch({
        type: actionTypes.IS_ERROR,
        payload: error.message,
      });
      return { error: error.message };
    } finally {
      dispatch({
        type: actionTypes.IS_LOADING,
        payload: false,
      });
    }
  };
};

export const getAllQuestion = () => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.IS_LOADING,
      payload: true,
    });
    try {
      const { data, status } = await api.teacher.getAllQuestion();

      if (status === 200) {
        dispatch({
          type: actionTypes.IS_ERROR,
          payload: null,
        });
        return { data };
      } else {
        dispatch({
          type: actionTypes.IS_ERROR,
          payload: data,
        });
        return { error: data };
      }
    } catch (error) {
      dispatch({
        type: actionTypes.IS_ERROR,
        payload: error.message,
      });
      return { error: error.message };
    } finally {
      dispatch({
        type: actionTypes.IS_LOADING,
        payload: false,
      });
    }
  };
};

export const editQuestion = (id, payload) => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.IS_LOADING,
      payload: true,
    });
    try {
      const { data, status } = await api.teacher.editQuestion(id, payload);

      if (status === 200) {
        dispatch({
          type: actionTypes.IS_ERROR,
          payload: null,
        });
        return { data };
      } else {
        dispatch({
          type: actionTypes.IS_ERROR,
          payload: data,
        });
        return { error: data };
      }
    } catch (error) {
      dispatch({
        type: actionTypes.IS_ERROR,
        payload: error.message,
      });
      return { error: error.message };
    } finally {
      dispatch({
        type: actionTypes.IS_LOADING,
        payload: false,
      });
    }
  };
};

export const deleteQuestion = (id) => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.IS_LOADING,
      payload: true,
    });
    try {
      const { data, status } = await api.teacher.deleteQuestion(id);

      if (status === 200) {
        dispatch({
          type: actionTypes.IS_ERROR,
          payload: null,
        });
        return { data };
      } else {
        dispatch({
          type: actionTypes.IS_ERROR,
          payload: data,
        });
        return { error: data };
      }
    } catch (error) {
      dispatch({
        type: actionTypes.IS_ERROR,
        payload: error.message,
      });
      return { error: error.message };
    } finally {
      dispatch({
        type: actionTypes.IS_LOADING,
        payload: false,
      });
    }
  };
};

export const setQuestionStatus = (payload) => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.IS_LOADING,
      payload: true,
    });
    try {
      const { data, status } = await api.teacher.setQuestionStatus(payload);

      if (status === 200) {
        dispatch({
          type: actionTypes.IS_ERROR,
          payload: null,
        });
        return { data };
      } else {
        dispatch({
          type: actionTypes.IS_ERROR,
          payload: data,
        });
        return { error: data };
      }
    } catch (error) {
      dispatch({
        type: actionTypes.IS_ERROR,
        payload: error.message,
      });
      return { error: error.message };
    } finally {
      dispatch({
        type: actionTypes.IS_LOADING,
        payload: false,
      });
    }
  };
};

export const getOneQuestion = (id) => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.IS_LOADING,
      payload: true,
    });
    try {
      const { data, status } = await api.teacher.getOneQuestion(id);

      if (status === 200) {
        dispatch({
          type: actionTypes.IS_ERROR,
          payload: null,
        });
        return { data };
      } else {
        dispatch({
          type: actionTypes.IS_ERROR,
          payload: data,
        });
        return { error: data };
      }
    } catch (error) {
      dispatch({
        type: actionTypes.IS_ERROR,
        payload: error.message,
      });
      return { error: error.message };
    } finally {
      dispatch({
        type: actionTypes.IS_LOADING,
        payload: false,
      });
    }
  };
};

export const teacherGetAllClass = () => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.IS_LOADING,
      payload: true,
    });
    try {
      const { data, status } = await api.teacher.getAllClass();

      if (status === 200) {
        dispatch({
          type: actionTypes.IS_ERROR,
          payload: null,
        });
        return { data };
      } else {
        dispatch({
          type: actionTypes.IS_ERROR,
          payload: data,
        });
        return { error: data };
      }
    } catch (error) {
      dispatch({
        type: actionTypes.IS_ERROR,
        payload: error.message,
      });
      return { error: error.message };
    } finally {
      dispatch({
        type: actionTypes.IS_LOADING,
        payload: false,
      });
    }
  };
};
