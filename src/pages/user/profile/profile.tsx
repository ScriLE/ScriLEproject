import { Footer } from "common/components/footer";
import { Header } from "common/components/header";
import { Button } from "common/components/ui/button";
import { Grid } from "common/components/ui/grid";
import { Typography } from "common/components/ui/typography";
import Logo from "common/images/logo-small.svg";
import styles from "./profile.module.scss";
import {useAppDispatch, useAppSelector} from "hooks/hooks";
import {Link, useNavigate} from "react-router-dom";
import React, {useCallback, useEffect} from "react";
import { Icon } from "common/components/ui/icon";
import { Backward } from "common/icons";
import { fetchProfile } from "services/app/actions/userActions";
import {useKeycloak} from "@react-keycloak/web";
import {SSO_ADMIN_ROLE} from "../../../helpers/constants";
import {PageFooter} from "../../../common/components/ui/pagefooter/page-footer";

export const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { keycloak } = useKeycloak();
  const hasAdminRole = keycloak.tokenParsed?.realm_access?.roles.includes(SSO_ADMIN_ROLE);

  const profile = useAppSelector(({ user }) => user.profile);

  useEffect(() => {
    (async () => {
      await dispatch(fetchProfile());
    })();
  }, [dispatch])

  const handleEditProfileClick = useCallback(() => {
    if(profile.ldapUser) return;
    navigate('/profile/edit')
  }, [navigate, profile.ldapUser]);

  return (
    <>
      <Header>
        <Grid container spacing={2}>
          <Grid item>
            <Link to={hasAdminRole ? '/admin' : '/'}>
              <img src={Logo} alt="logo iri" />
            </Link>
          </Grid>
          <Grid item className={styles.header}>
            <Icon component={Backward} onClick={() => navigate('/')} />
            <Typography variant="body4" weight="500">
              Профиль
            </Typography>
          </Grid>
        </Grid>
      </Header>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <div className={styles.grid}>
            <Typography variant="body3" component="div" weight="400">
              E-mail
            </Typography>
            <Typography variant="body3" component="div" weight="500">
              {profile.email}
            </Typography>
          </div>
          <div className={styles.grid}>
            <Typography variant="body3" component="div" weight="400">
              Имя
            </Typography>
            <Typography variant="body3" component="div" weight="500">
              {profile.firstName}
            </Typography>
          </div>
          <div className={styles.grid}>
            <Typography variant="body3" component="div" weight="400">
              Фамилия
            </Typography>
            <Typography variant="body3" component="div" weight="500">
              {profile.lastName}
            </Typography>
          </div>
          {profile.patrName && <div className={styles.grid}>
            <Typography variant="body3" component="div" weight="400">
              Отчество
            </Typography>
            <Typography variant="body3" component="div" weight="500">
              {profile.patrName}
            </Typography>
          </div>}
          {profile.phone && <div className={styles.grid}>
            <Typography variant="body3" component="div" weight="400">
              Телефон
            </Typography>
            <Typography variant="body3" component="div" weight="500">
              {formatPhone(profile.phone)}
            </Typography>
          </div>}
          {profile.telegram && <div className={styles.grid}>
            <Typography variant="body3" component="div" weight="400">
              Telegram
            </Typography>
            <Typography variant="body3" component="div" weight="500">
              {profile.telegram}
            </Typography>
          </div>}
          <Button wide onClick={handleEditProfileClick} disabled={profile.ldapUser} >Редактировать</Button>
        </Grid>
      </Grid>
      <Footer>
        <PageFooter />
      </Footer>
    </>
  );
};

const formatPhone = (value: string) => {

  let match = value.replace(/^\+7/, '').match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
  if(match) return `+7 (${match[1] || '___'}) ${match[2] || '___'}-${match[3] || '__'}-${match[4] || '__'}`;
  return value;
}