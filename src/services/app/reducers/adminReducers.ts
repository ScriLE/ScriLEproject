import {
  ADMIN_SET_SYSTEMS,
  ADMIN_SET_SYSTEM,
  ADMIN_SET_ADMIN,
  ADMIN_SET_AGREEMENTS,
  ADMIN_SET_AGREEMENT,
  ADMIN_SET_USER_AGREEMENTS,
} from "constants/redux";
import {SystemPageDto, AgreementPageDto, SystemDto, AgreementDto} from "api/dto";
import {UserAgreementDto} from "../../../api/dto/UserAgreementDto";

export const initialAdminState = {
  loading: false,
  error: undefined as string | undefined,
  systems: { items: [], pageSize: 10, pageNumber: 1, totalCount: 0, totalPageCount: 0 } as SystemPageDto,
  system: {} as Partial<SystemDto>,
  agreements: { items: [], pageSize: 10, pageNumber: 1, totalCount: 0, totalPageCount: 0 } as AgreementPageDto,
  agreement: {} as Partial<AgreementDto>,
  userAgreements: [] as UserAgreementDto[],
};

export const adminReducer = (state = initialAdminState, action: any) => {
  switch (action.type) {
    case ADMIN_SET_ADMIN:
      return {
        ...state,
        admin: action.payload,
      };
    case ADMIN_SET_SYSTEMS:
      return {
        ...state,
        systems: action.payload as SystemPageDto || initialAdminState.systems,
      };
    case ADMIN_SET_SYSTEM:
      return {
        ...state,
        system: action.payload as SystemDto || initialAdminState.system,
      };
    case ADMIN_SET_AGREEMENTS:
      return {
        ...state,
        agreements: action.payload as AgreementPageDto || initialAdminState.agreements,
      };
    case ADMIN_SET_AGREEMENT:
      return {
        ...state,
        agreement: action.payload as AgreementDto || initialAdminState.agreement,
      };
    case ADMIN_SET_USER_AGREEMENTS:
      return {
        ...state,
        userAgreements: action.payload as UserAgreementDto[] || initialAdminState.userAgreements,
      };
    default:
      return state;
  }
};
