import api from '@/api';
import actionTypes from '@/constant/actionTypes';

export const getStudentProfile = () => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.IS_LOADING,
      payload: true,
    });
    try {
      const { data, status } = await api.student.getStudentProfile();

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

export const studentGetAllQuestion = (id) => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.IS_LOADING,
      payload: true,
    });
    try {
      const { data, status } = await api.student.getAllQuestion(id);

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

export const getOneQuestion = ({ question_id }) => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.IS_LOADING,
      payload: true,
    });
    try {
      const { data, status } = await api.student.getOneQuestion(question_id);

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

export const getOneToken = (secret_token) => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.IS_LOADING,
      payload: true,
    });
    try {
      const { data, status } = await api.token.getOneToken(secret_token);

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

export const initResult = (payload) => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.IS_LOADING,
      payload: true,
    });
    try {
      const { data, status } = await api.student.initResult(payload);

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

export const collectResult = (id, payload) => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.IS_LOADING,
      payload: true,
    });
    try {
      const { data, status } = await api.student.collectResult(id, payload);

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
export const getResult = () => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.IS_LOADING,
      payload: true,
    });
    try {
      const { data, status } = await api.student.getResult();

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
