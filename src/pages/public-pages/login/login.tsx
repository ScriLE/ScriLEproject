import { Header } from "common/components/header";
import { useEffect } from "react";
import { Navigate, useLocation } from 'react-router-dom'

import { useKeycloak } from '@react-keycloak/web'

export const Login = () => {
  const location = useLocation();
  const { keycloak } = useKeycloak();

  const currentLocationState =  location.state || {
    from: { pathname: '/systems' },
  }

  useEffect(() => {
    (async () => {
      if(keycloak.authenticated) {

        await keycloak.updateToken(5);
        return;
      }

      try {
        void keycloak?.login({ redirectUri:  window.location.origin + currentLocationState.from.pathname })
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  if (keycloak?.authenticated) return <Navigate to={currentLocationState.from} replace/>;

  return (
    <>
      <Header>
        {/*<Typography variant="body4" weight="500">*/}
        {/*  Вход*/}
        {/*</Typography>*/}
      </Header>
    </>
  );
};
