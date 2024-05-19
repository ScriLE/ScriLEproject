import { COMMON_SET_ERROR, COMMON_SET_LOADING } from "../../../constants/redux";

export const initialCommonState = {
  loading: false,
  error: undefined as string | undefined,
};

export const commonReducer = (state = initialCommonState, action: any) => {
  switch (action.type) {
    case COMMON_SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case COMMON_SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};