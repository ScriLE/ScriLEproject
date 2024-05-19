import { Header } from "common/components/header";
import { Grid } from "common/components/ui/grid";
import { Typography } from "common/components/ui/typography";
import { Footer } from "common/components/footer";
import styles from "./systems.module.scss";
import Logo from "common/images/logo.svg";
import {useEffect, useMemo} from "react";
import { useKeycloak } from "@react-keycloak/web";
import { fetchSystems } from "services/app/actions/userActions";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import { SSO_ADMIN_ROLE } from "helpers/constants";
import { Link } from "react-router-dom";
import { noLogo, administrationLogo } from "../../../constants/misc";
import {PageFooter} from "../../../common/components/ui/pagefooter/page-footer";

export const Systems = () => {
  const dispatch = useAppDispatch();
  const { keycloak, initialized } = useKeycloak();
  const { items: systems } = useAppSelector(({ user }) => user.systems)
  const hasAdminRole = keycloak.tokenParsed?.realm_access?.roles.includes(SSO_ADMIN_ROLE);

  useEffect(() => {
    if(!initialized) return;
    (async () => {
      dispatch(fetchSystems())
    })();
  }, [initialized, dispatch]);

  const sortedSystems = useMemo(() => {
    return systems.sort(({ name: nameA }, { name: nameB }) => nameA.localeCompare(nameB));
  }, [systems]);

  return (
    <>
      <Header>
        <Grid container spacing={2}>
          <Grid item>
            <img src={Logo} alt="logo iri" />
          </Grid>
        </Grid>
      </Header>
      <Grid container spacing={2}>
        <Grid item xs={12} className={styles.page}>
          <div className={styles.pageContent}>
            <div className={styles.systemsHeading}>Выбор системы</div>
            <div className={styles.systemsWrapper}>
              {hasAdminRole && <Link to={'/admin'} className={styles.systemCard}>
                <div className={styles.systemCover} style={{ backgroundImage: `url(${administrationLogo})` }} />
                <Typography variant="body3" weight="400">Администрирование</Typography>
              </Link>}
              {sortedSystems.map((item) => <a key={item.id} className={styles.systemCard} href={item.url} >
                <div className={styles.systemCover} style={{ backgroundImage: item.logoUrl ? `url(${item.logoUrl})` : `url(${noLogo})` }} />
                <Typography variant="body3" weight="400">
                  {item.name}
                </Typography>
              </a>)}
             </div>
          </div>
        </Grid>
      </Grid>
      <Footer>
        <PageFooter />
      </Footer>
    </>
  );
};
