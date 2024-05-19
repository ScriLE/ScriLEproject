import { COMMON_SET_ERROR, COMMON_SET_LOADING } from "constants/redux";

export const setLoading = (payload: boolean) => ({
  type: COMMON_SET_LOADING,
  payload
});

export const setError = (payload: boolean) => ({
  type: COMMON_SET_ERROR,
  payload
});
