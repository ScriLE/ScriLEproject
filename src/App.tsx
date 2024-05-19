import React from "react";
import { MainLayout } from "./layouts/main-layout";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./Keycloak";
import { store } from "./store/redux-store";
import ProtectedRoute from "./helpers/protected-route";
import { SSO_ADMIN_ROLE, SSO_USER_ROLE } from "./helpers/constants";
import { Systems, Profile, ProfileEdit } from "pages/user";
import { Agreements, SystemsAdmin, SystemsAdd, Upload } from "pages/admin";
import { Page404 } from "pages/public-pages";
import { AuthClientError, AuthClientEvent } from "@react-keycloak/core/lib/types";
import { System } from "pages/admin/system";
import { AttachAgreements } from "./pages/admin/attach-agreement";
import { SystemUsers } from "./pages/admin/users/system-users";
import { AgreementContent } from "./pages/common/agreement-content/agreement-content";
import { EmailEdit } from "./pages/user/email-edit";
import { PasswordReset } from "./pages/user/password-reset";
import { Notifications } from "./common/components/notifications";

export const App = () => {
  const eventLogger = (eventType: AuthClientEvent, error?: AuthClientError) => {
    if(eventType === 'onAuthRefreshError') window.location.reload();
  }

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        checkLoginIframe: false,
      }}
      autoRefreshToken={false}
      onEvent={eventLogger}
    >
      <Notifications placement="middle">
        <Provider store={store}>
          <Router>
            <Routes>
              <Route path="/" element={<MainLayout />} >
                <Route index element={
                  <ProtectedRoute role={SSO_USER_ROLE} title={'Системы'}><Systems /></ProtectedRoute>
                } />
                <Route path="data/agreements/:id" element={
                  <ProtectedRoute role={SSO_USER_ROLE}><AgreementContent /></ProtectedRoute>
                } />
                <Route path="edit-email" element={
                  <ProtectedRoute role={SSO_USER_ROLE} title={'Смена e-mail'}><EmailEdit /></ProtectedRoute>
                } />
                <Route path="edit-password" element={
                  <ProtectedRoute role={SSO_USER_ROLE} title={'Смена пароля'}><PasswordReset /></ProtectedRoute>
                } />
                <Route path="profile">
                  <Route index element={
                    <ProtectedRoute role={SSO_USER_ROLE} title={'Профиль'}><Profile /></ProtectedRoute>
                  } />
                  <Route path="edit" element={
                    <ProtectedRoute role={SSO_USER_ROLE} title={'Редактирование профиля'}><ProfileEdit /></ProtectedRoute>
                  } />
                </Route>

                <Route path="admin">
                  <Route index element={
                    <ProtectedRoute role={SSO_ADMIN_ROLE} title={'Справочник систем'}><SystemsAdmin /></ProtectedRoute>
                  } />
                  <Route path="systems">
                    <Route path="add" element={
                      <ProtectedRoute role={SSO_ADMIN_ROLE} title={'Добавить систему'}><SystemsAdd /></ProtectedRoute>
                    } />
                    <Route path="detail/:id" element={
                      <ProtectedRoute role={SSO_ADMIN_ROLE} title={'Изменить систему'}><System /></ProtectedRoute>
                    } />
                    <Route path="attach-agreement/:id" element={
                      <ProtectedRoute role={SSO_ADMIN_ROLE} title={'Привязка согласий'}><AttachAgreements /></ProtectedRoute>
                    } />
                  </Route>
                  <Route path="agreements">
                    <Route index element={
                      <ProtectedRoute role={SSO_ADMIN_ROLE} title={'Справочник согласий'}><Agreements /></ProtectedRoute>
                    } />
                    <Route path="upload">
                      <Route index element={
                        <ProtectedRoute role={SSO_ADMIN_ROLE} title={'Загрузка нового согласия'}><Upload /></ProtectedRoute>
                      } />
                      <Route path=":id" element={
                        <ProtectedRoute role={SSO_ADMIN_ROLE} title={'Изменение согласия'}><Upload /></ProtectedRoute>
                      } />
                    </Route>
                  </Route>
                  <Route path="users" element={
                    <ProtectedRoute role={SSO_ADMIN_ROLE} title={'Пользователи'}><SystemUsers /></ProtectedRoute>
                  } />
                </Route>
                <Route path="*" element={<Page404 />} />
              </Route>
            </Routes>
          </Router>
        </Provider>
      </Notifications>
    </ReactKeycloakProvider>
  );
};

export default App;
