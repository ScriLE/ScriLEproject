import { thunkActionCreator } from "store/redux-store";
import {adminAPI, AgreementContentPayload, GetPaginatedDataPayload} from "api";
import {
  ADMIN_SET_AGREEMENT,
  ADMIN_SET_AGREEMENTS,
  ADMIN_SET_SYSTEM,
  ADMIN_SET_SYSTEMS,
  ADMIN_SET_USER_AGREEMENTS,
} from "constants/redux";
import {SystemDto, AgreementPageDto, SystemPageDto, AgreementDto} from "api/dto";
import {UserAgreementDto} from "../../../api/dto/UserAgreementDto";


export const setAdminSystems = (payload: SystemPageDto) => ({
  type: ADMIN_SET_SYSTEMS,
  payload
});

export const setAdminSystem = (payload: SystemDto) => ({
  type: ADMIN_SET_SYSTEM,
  payload
});

export const setAdminAgreements = (payload: AgreementPageDto) => ({
  type: ADMIN_SET_AGREEMENTS,
  payload
});

export const setAdminAgreement = (payload: AgreementDto) => ({
  type: ADMIN_SET_AGREEMENT,
  payload
});

export const setAdminUserAgreements = (payload: UserAgreementDto[]) => ({
  type: ADMIN_SET_USER_AGREEMENTS,
  payload
});

export const fetchSystems = thunkActionCreator<GetPaginatedDataPayload, SystemPageDto>(
  adminAPI.getSystems,
  setAdminSystems
);

export const fetchSystem = thunkActionCreator<number, SystemDto>(
  adminAPI.getSystem,
  setAdminSystem
);

export const modifySystem = thunkActionCreator<SystemDto, SystemDto>(
  adminAPI.updateSystem
);

export const modifySystemAgreements = thunkActionCreator<{ id: number, payload: number[] }, null>(
  adminAPI.updateSystemAgreements
);


export const syncSystemUsers = thunkActionCreator<{ id: number }, null>(
  adminAPI.syncSystemUsers
);

export const removeSystem = thunkActionCreator<number, null>(
  adminAPI.deleteSystem
);

export const fetchAgreements = thunkActionCreator<GetPaginatedDataPayload, AgreementPageDto>(
  adminAPI.getAgreements,
  setAdminAgreements
);

export const removeAgreement = thunkActionCreator<number, null>(
  adminAPI.deleteAgreement
);

export const fetchAgreement = thunkActionCreator<number, AgreementDto>(
  adminAPI.getAgreement,
  setAdminAgreement
);

export const createAgreement = thunkActionCreator<Pick<AgreementDto, 'name' | 'version'>, AgreementDto>(
  adminAPI.createAgreement
);

export const modifyAgreement = thunkActionCreator<Omit<AgreementDto, 'link' | 'created'>, null>(
  adminAPI.updateAgreement
);

export const uploadAgreementContent = thunkActionCreator<AgreementContentPayload, null>(
  adminAPI.uploadAgreementContent
)

export const searchUserAgreements = thunkActionCreator<string, UserAgreementDto[]>(
  adminAPI.getUserAgreements,
  setAdminUserAgreements
)
