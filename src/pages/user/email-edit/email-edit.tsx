import { Footer } from "common/components/footer";
import { Header } from "common/components/header";
import { Grid } from "common/components/ui/grid";
import { Typography } from "common/components/ui/typography";
import Logo from "common/images/logo-small.svg";
import styles from "./email-edit.module.scss";
import React, {ChangeEvent, useCallback, useState} from "react";
import {Link, Navigate, useNavigate} from "react-router-dom";
import { Input } from "common/components/ui/input";
import { Button } from "common/components/ui/button";
import { useKeycloak } from "@react-keycloak/web";
import { Icon } from "common/components/ui/icon";
import { Backward } from "common/icons";
import {useAppDispatch, useAppSelector} from "hooks/hooks";
import { modifyEmail } from "services/app/actions/userActions";
import { useNotifications } from "common/components/notifications";
import {SSO_ADMIN_ROLE} from "../../../helpers/constants";
import {PageFooter} from "../../../common/components/ui/pagefooter/page-footer";

export const EmailEdit = () => {
  const navigate = useNavigate();
  const profile = useAppSelector(({ user }) => user.profile);
  const [email, setEmail] = useState('');
  const [errorValidation, setErrorValidation] = useState<string>()
  const { keycloak } = useKeycloak();
  const dispatch = useAppDispatch();
  const { error } = useNotifications();
  const hasAdminRole = keycloak.tokenParsed?.realm_access?.roles.includes(SSO_ADMIN_ROLE);

  const validateEmail = useCallback(() => {
    if(!validateEmailRegexp.test(email)) {
      setErrorValidation('Некорректный email');
      return false;
    }
    if(disabledDomains.some(domain => email.endsWith(`@${domain}`))) {
      setErrorValidation('Некорректный почтовый домен');
      return false;
    }
    return true;
  }, [email]);


  const handleSubmit = useCallback(async () => {
    if(!validateEmail()) return;

    try {
      await dispatch(modifyEmail(email));
      keycloak.logout({ redirectUri: window.location.origin});
    }
    catch(e) {
      if(e.response?.status === 409) {
        error('Ошибка смены email: попытка привязать email существующего пользователя.');
        return;
      }
      error(`Ошибка смены email: ${e}`);
    }
  }, [keycloak, email, dispatch, error, validateEmail]);

  const handleCancel = useCallback(() => {
    navigate('/');
  }, [navigate]);

  if(profile.ldapUser) return <Navigate to={'/'} />;

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
              Смена e-mail
            </Typography>
          </Grid>
        </Grid>
      </Header>
      <div className={styles.page}>
        <Grid container spacing={2}>
          <Grid item sm={12}>
            <Input
              name="email"
              isError={!!errorValidation}
              errors={!!errorValidation ? { email: { message: errorValidation }  } : {}}
              label={'Новый e-mail'}
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item sm={5}>
            <Button type="reset" variant="outlined" onClick={handleCancel} wide>
              Отмена
            </Button>
          </Grid>
          <Grid item sm={7}>
            <Button type="submit" onClick={handleSubmit} wide>
              Изменить e-mail
            </Button>
          </Grid>
        </Grid>
        
        <div>После смены email автоматически будет выполнен выход из системы.</div>
      </div>
      <Footer>
        <PageFooter />
      </Footer>
    </>
  );
};


const disabledDomains = ['iri.center'];
// eslint-disable-next-line
const validateEmailRegexp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;