import React, {FC, ReactElement, useEffect, useMemo} from "react";
import {Navigate, useLocation} from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import styles from "../layouts/main-layout/main-layout.module.scss";
import {ReactComponent as Spinner} from "../common/images/spinner.svg";
// import {Page404} from "../pages/public-pages/page-404";

type ProtectedRouteProps = {
  role: string
  redirectPath?: string
  children: ReactElement<any, any> | null
  title?: string
}

const minValidity = 5;

const ProtectedRoute: FC<ProtectedRouteProps> = ({
  role,
  redirectPath = '/',
  children,
  title
}) => {
  const { initialized, keycloak } = useKeycloak();
  const location = useLocation();
  const fromLocation =  useMemo(() => ({ pathname: location.pathname || '/' }), [location.pathname]);

  useEffect(() => {
    if(!title) return;
    document.title = title;
  }, [title])

  useEffect(() => {
   if(!initialized || keycloak.authenticated) return;
    keycloak.login({ redirectUri:  window.location.origin + fromLocation.pathname });

    (async () => {
      await keycloak.updateToken(minValidity);
    })();
  }, [initialized, keycloak, fromLocation.pathname]);

  // wait to initialize keycloak adapter
  if(!keycloak || !initialized) return <div className={styles.loaderBackdrop}>
    <Spinner />
  </div>;

  // user not authenticated
  if(!keycloak.authenticated) return null;

  // redirect if user hasn't role to access
  const hasRole = keycloak.tokenParsed?.realm_access?.roles.includes(role);

  if(keycloak.authenticated && !hasRole) return <Navigate to={redirectPath} />;

  // 404 if user hasn't role to access
  // if(keycloak.authenticated && !keycloak.tokenParsed?.realm_access?.roles.includes(role)) return <Page404 />;

  return children;
};

export default ProtectedRoute;
