import {
  STATUS_SET_STATUS,
} from "constants/redux";

export const setStatus = (payload: any) => ({
  type: STATUS_SET_STATUS,
  payload,
});
