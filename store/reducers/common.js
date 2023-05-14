import actionTypes from '@/constant/actionTypes';

const initialState = {
  isLoading: false,
  error: null,
  role: '',
  pageTitle: '',
};

export default function common(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_PAGE_TITLE:
      return {
        ...state,
        role: action.payload,
      };
    case actionTypes.SET_ROLE:
      return {
        ...state,
        role: action.payload,
      };

    case actionTypes.IS_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.IS_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case actionTypes.IS_SUCCESS:
      return {
        ...state,
        isSuccess: action.payload,
      };

    default:
      return state;
  }
}
