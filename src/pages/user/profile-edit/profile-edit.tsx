import { Footer } from "common/components/footer";
import { Header } from "common/components/header";
import { Grid } from "common/components/ui/grid";
import { Typography } from "common/components/ui/typography";
import Logo from "common/images/logo-small.svg";
import styles from "./profile-edit.module.scss";
import { ProfileForm } from "common/forms/profile/profile";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import React, { useCallback } from "react";
import {Link, Navigate, useNavigate} from "react-router-dom";
import { Icon } from "common/components/ui/icon";
import { Backward } from "common/icons";
import { modifyProfile } from "services/app/actions/userActions";
import { useNotifications } from "common/components/notifications";
import {useKeycloak} from "@react-keycloak/web";
import {SSO_ADMIN_ROLE} from "../../../helpers/constants";
import {PageFooter} from "../../../common/components/ui/pagefooter/page-footer";

export const ProfileEdit = () => {
  const navigate = useNavigate();
  const profile = useAppSelector(({ user }) => user.profile);
  const dispatch = useAppDispatch();
  const { error, info } = useNotifications();
  const { keycloak } = useKeycloak();
  const hasAdminRole = keycloak.tokenParsed?.realm_access?.roles.includes(SSO_ADMIN_ROLE);

  const handleSubmit = useCallback(async ({ id, email, modifyTimestamp, ...rest }: Profile) => {
    try{
      await dispatch(modifyProfile({...rest}));
      info('Профиль успешно изменен');
      navigate('/profile');
    }
    catch(e) {
      error(`Ошибка сохранения профиля: ${e}`);
    }
  }, [navigate, dispatch, info, error]);

  const handleCancel = useCallback(() => {
    navigate('/profile');
  }, [navigate]);

  if(profile.ldapUser) return <Navigate to={'/profile'} />;

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
            <Icon component={Backward} onClick={() => navigate(-1)} />
            <Typography variant="body4" weight="500">
              Редактирование профиля
            </Typography>
          </Grid>
        </Grid>
      </Header>
      <div className={styles.page}>
        <ProfileForm defaultValues={profile} onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
      <Footer>
        <PageFooter />
      </Footer>
    </>
  );
};
