import {
  USER_SET_SYSTEMS,
  AUTH,
  STATUS_SET_STATUS,
  USER_SET_AGREEMENTS,
  USER_SET_USER,
  USER_SET_SYSTEM
} from "constants/redux";
import { AgreementDto, SystemDto, SystemPageDto } from "api/dto";

export const initialUserState = {
  profile: {} as Profile,
  status: {} as any,
  user: {} as any,
  systems: { items: [], pageSize: 10, pageNumber: 1, totalCount: 0, totalPageCount: 0 } as SystemPageDto,
  agreements: [] as AgreementDto[],
  system: {} as SystemDto,
};


export const userReducer = (state = initialUserState, action: any) => {
  switch (action.type) {
    case AUTH:
      return {
        ...state,
        auth: action.payload,
      };
    case STATUS_SET_STATUS:
      return {
        ...state,
        status: action.payload,
      };
    case USER_SET_USER:
      return {
        ...state,
        profile: action.payload as Profile,
      };
    case USER_SET_SYSTEMS:
      return {
        ...state,
        systems: action.payload as SystemPageDto || initialUserState.systems,
      };
    case USER_SET_AGREEMENTS:
      return {
        ...state,
        agreements: action.payload as AgreementDto[] || [],
      };
    case USER_SET_SYSTEM:
      return {
        ...state,
        system: action.payload as SystemDto || initialUserState.system,
      };
    default:
      return state;
  }
};
