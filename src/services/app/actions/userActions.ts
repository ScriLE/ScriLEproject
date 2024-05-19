import { thunkActionCreator } from "store/redux-store";
import { userAPI } from "api";
import { USER_SET_SYSTEM, USER_SET_SYSTEMS, USER_SET_USER } from "constants/redux";
import { SystemDto, SystemPageDto } from "api/dto";

export const setSystems = (payload: SystemPageDto) => ({
  type: USER_SET_SYSTEMS,
  payload,
});

export const setSystem = (payload: SystemDto) => ({
  type: USER_SET_SYSTEM,
  payload,
});

export const setUser = (payload: Profile) => ({
  type: USER_SET_USER,
  payload,
});

export const fetchProfile = thunkActionCreator<void, Profile>(
  userAPI.getProfile,
  setUser
);

export const fetchSystems = thunkActionCreator<void, SystemPageDto>(
  userAPI.getSystems,
  setSystems
);

export const modifyProfile = thunkActionCreator<Pick<Profile, 'firstName' | 'lastName' | 'patrName' | 'phone'>, null>(
  userAPI.updateProfile,
);

export const modifyEmail = thunkActionCreator<string, null>(
  userAPI.updateEmail,
);

export const modifyPassword = thunkActionCreator<string, null>(
  userAPI.updatePasword,
);
