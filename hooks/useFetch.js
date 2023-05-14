import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actionTypes from '@/constant/actionTypes';

import { fetchLogin } from '@/store/actions';

export default function useFetch(type, payload) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (type) {
      dispatch({
        type: actionTypes.IS_LOADING,
        payload: true,
      });

      switch (type) {
        case actionTypes.LOGIN:
          dispatch(fetchLogin(payload));
          break;

        default:
          break;
      }
    }
  }, [type, dispatch, payload]);

  return;
}
