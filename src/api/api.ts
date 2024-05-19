import axios from "axios";
import keycloak from "../Keycloak";
import { AgreementContentPayload, AgreementsPayload, GetPaginatedDataPayload } from "./types";
import { serializeToQuery } from "./helper";
import { SystemPageDto, SystemDto, AgreementPageDto, AgreementDto } from "./dto";
import { SystemAgreementsDto } from "./dto/SystemAgreementsDto";
import {UserAgreementDto} from "./dto/UserAgreementDto";

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true,
  paramsSerializer: {
    serialize: serializeToQuery
  },
  validateStatus: (status) => [200, 201].includes(status),
  timeoutErrorMessage: 'Нет подключения к сети',
});

const defaultHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
}

export const statusAPI = {
  getStatus() {
    return instance.get("status", {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        ...defaultHeaders,
      },
    });
  },
};

export const commonAPI = {
  getAgreementContent(id: number) {
    return instance.get(`/data/agreements/${id}`, {
      params: { agrIdStr: id },
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        ...defaultHeaders,
      },
    });
  },
};

export const userAPI = {
  getSystems() {
    return instance.get<SystemPageDto>("user/systems", {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        ...defaultHeaders,
      },
    });
  },
  getAgreements(payload: AgreementsPayload ) {
    return instance.get<SystemAgreementsDto>(`/user/system/agreements/${payload.view}`, {
      params: { client_id: payload.clientId },
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        ...defaultHeaders,
      },
    });
  },
  acceptAgreement(id: number) {
    return instance.post(`/user/accept/agreement/${id}`, {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        ...defaultHeaders,
      },
    });
  },
  getProfile() {
    return instance.get("/user/", {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        ...defaultHeaders,
      },
    });
  },
  updateProfile(payload: Pick<Profile, 'firstName' | 'lastName' | 'patrName' | 'phone'>) {
    return instance.put("/user/", payload, {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        ...defaultHeaders,
      },
    });
  },
  updateEmail(email: string) {
    return instance.put("/user/email", { email }, {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        ...defaultHeaders,
      },
    });
  },
  updatePasword(password: string) {
    return instance.put("/user/password", { password }, {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        ...defaultHeaders,
      },
    });
  }
};

export const adminAPI = {
  getAdmin() {
    return instance.get("admin/secret", {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        ...defaultHeaders,
      },
    });
  },
  getSystems(payload: GetPaginatedDataPayload) {
    return instance.get<SystemPageDto>("admin/systems", {
      params: payload,
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        ...defaultHeaders,
      },
    });
  },
  getSystem(id: number) {
    return instance.get<SystemDto>(`admin/systems/${id}`, {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        ...defaultHeaders,
      },
    });
  },
  createSystem(payload: Pick<SystemDto, 'name' | 'url' | 'logoUrl' | 'kcClient'>) {
    return instance.post<SystemDto>("admin/systems", payload,{
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        ...defaultHeaders,
      },
    });
  },
  updateSystem(payload: Omit<SystemDto, 'requiredAgreements' | 'description'>) {
    return instance.put<SystemDto>(`admin/systems/${payload.id}`, payload,{
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        ...defaultHeaders,
      },
    });
  },
  updateSystemAgreements({ id, payload }: { id: number, payload: number[] }) {
    return instance.put<null>(`admin/systems/${id}/agreements`, payload,{
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        ...defaultHeaders,
      },
    });
  },
  syncSystemUsers({ id }: { id: number }) {
    return instance.post<null>(`admin/systems/${id}/users/sync`, null,{
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        ...defaultHeaders,
      },
    });
  },
  deleteSystem(id: number) {
    return instance.delete<null>(`admin/systems/${id}`, {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        ...defaultHeaders,
      },
    });
  },
  getAgreements(payload: GetPaginatedDataPayload) {
    return instance.get<AgreementPageDto>("admin/agreements", {
      params: payload,
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        ...defaultHeaders,
      },
    });
  },
  getAgreement(id: number) {
    return instance.get<AgreementDto>(`admin/agreements/${id}`, {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        ...defaultHeaders,
      },
    });
  },
  createAgreement(payload: Pick<AgreementDto, 'name' | 'version'>) {
    return instance.post<AgreementDto>(`admin/agreements`, payload,{
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        ...defaultHeaders,
      },
    });
  },
  updateAgreement(payload: Omit<AgreementDto, 'link' | 'created'>) {
    return instance.put<null>(`admin/agreements/${payload.id}`, payload,{
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        ...defaultHeaders,
      },
    });
  },
  uploadAgreementContent(payload: AgreementContentPayload) {
    return instance.put(`admin/agreements/${payload.id}/content`, payload.file,{
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        ...defaultHeaders,
        'Content-Type': 'application/pdf',
      },
    });
  },
  deleteAgreement(id: number) {
    return instance.delete<null>(`admin/agreements/${id}`, {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        ...defaultHeaders,
      },
    });
  },
  getUserAgreements(query: string) {
    return instance.get<UserAgreementDto[]>(`admin/agreements/users/search`, {
      params: { query },
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        ...defaultHeaders,
      },
    });
  },
};


