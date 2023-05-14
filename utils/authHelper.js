import LS_KEYS from '@/constant/localStorage';

// Auth Token Helper

export const getUserAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(LS_KEYS.AUTH_TOKEN_KEY);
  }
};

export const setUserAuthToken = (authToken) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LS_KEYS.AUTH_TOKEN_KEY, authToken);
  }
};

export const removeUserAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LS_KEYS.AUTH_TOKEN_KEY);
  }
};

// User Details Helper
export const getLocalUserDetails = () => {
  if (typeof window !== 'undefined') {
    JSON.parse(localStorage.getItem(LS_KEYS.USER_DETAILS_KEY));
  }
};

export const setLocalUserDetails = (userDetails) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LS_KEYS.USER_DETAILS_KEY, JSON.stringify(userDetails));
  }
};

export const removeLocalUserDetails = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LS_KEYS.USER_DETAILS_KEY);
  }
};
