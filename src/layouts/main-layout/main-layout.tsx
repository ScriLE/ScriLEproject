import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styles from "./main-layout.module.scss";
import { Aside } from "common/components/aside";
import { useKeycloak } from "@react-keycloak/web";
import { SSO_ADMIN_ROLE } from "helpers/constants";
import { useEffect } from "react";
import { useAppSelector } from "../../hooks/hooks";
import { ReactComponent as Spinner} from '../../common/images/spinner.svg';

export const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { keycloak } = useKeycloak();
  const hasAdminRole = keycloak.tokenParsed?.realm_access?.roles.includes(SSO_ADMIN_ROLE);
  const loading = useAppSelector(({ common: { loading } }) => loading);

  useEffect(() => {
    if(hasAdminRole) {
      navigate('/admin');
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  return (
    <>
      <div className={styles.mainLayout}>
        {location.pathname.includes('admin') && hasAdminRole && <Aside className={styles.mainAside} />}
        <div className={styles.mainContent}>
          <main className={styles.main}>
            <Outlet />
            {loading && <div className={styles.loaderBackdrop}>
              <Spinner />
            </div>}
          </main>
        </div>
      </div>
    </>
  );
};
