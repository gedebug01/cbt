import api from '@/api';
import actionTypes from '@/constant/actionTypes';

export const fetchLogin = (payload) => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.IS_LOADING,
      payload: true,
    });
    try {
      const { data, response } = await api.auth.login(payload);

      if (data) {
        dispatch({
          type: actionTypes.SET_ROLE,
          payload: data.role,
        });
        return { data };
      } else {
        const { data: error } = response;
        dispatch({
          type: actionTypes.IS_ERROR,
          payload: error,
        });
        return { error };
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

export const fetchAuth = () => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.IS_LOADING,
      payload: true,
    });
    try {
      const { data } = await api.auth.getAuth();
      if (data) {
        dispatch({
          type: actionTypes.IS_ERROR,
          payload: null,
        });
        dispatch({
          type: actionTypes.SET_ROLE,
          payload: data.role,
        });
        return { data };
      } else {
        const { data: error } = response;
        dispatch({
          type: actionTypes.IS_ERROR,
          payload: error,
        });
        return null;
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
