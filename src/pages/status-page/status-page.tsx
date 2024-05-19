import { Container } from "common/components/ui/container/container";
import keycloak from "../../Keycloak";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import { setAuth, setStatus } from "services/app/actions";
import { statusAPI } from "api/api";
import { useKeycloak } from "@react-keycloak/web";
import { Button } from "common/components/ui/button";

export const StatusPage = () => {
  const [authKeycloak, setAthKeycloak] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.app.status);

  const initialized = useKeycloak();

  useEffect(() => {
    setAthKeycloak(!!keycloak.authenticated);
    dispatch(setAuth(keycloak));
  }, [dispatch, initialized.initialized]);

  const handleGetStatus = () => {
    statusAPI
      .getStatus()
      .then((res) => dispatch(setStatus(res.data)))
      .then((res) => console.log(res))
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Container>
        {!initialized.initialized ? (
          <h3>Загрузка...</h3>
        ) : (
          <>
            <div>
              <div>authenticated: {authKeycloak.toString()}</div>
              <Button onClick={handleGetStatus}>get status</Button>
              {status?.version?.version ? (
                <ul>
                  <li>
                    version.version:
                    {status.version.version}
                  </li>
                  <li>version.build:{status.version.build}</li>
                  <li>
                    version.gitCommit:
                    {status.version.gitCommit}
                  </li>
                  <li>version.gitTag: {status.version.gitTag}</li>
                  <li>system.memoryMax: {status.system.memoryMax}</li>
                  <li>system.memoryTotal: {status.system.memoryTotal}</li>
                  <li>system.memoryFree: {status.system.memoryFree}</li>
                  <li>system.diskTotal: {status.system.diskTotal}</li>
                  <li>system.diskFree: {status.system.diskFree}</li>
                </ul>
              ) : null}
            </div>
            <br />
          </>
        )}
      </Container>
    </>
  );
};
