import { Footer } from "common/components/footer";
import { Header } from "common/components/header";
import { Grid } from "common/components/ui/grid";
import { Typography } from "common/components/ui/typography";
import Logo from "common/images/logo-small.svg";
import styles from "./password-reset.module.scss";
import React, {ChangeEvent, useCallback, useState} from "react";
import {Link, Navigate, useNavigate} from "react-router-dom";
import { Input } from "common/components/ui/input";
import { Button } from "common/components/ui/button";
import { useKeycloak } from "@react-keycloak/web";
import cs from "classnames";
import { Icon } from "common/components/ui/icon";
import {Backward, Eye, EyeCrossed} from "common/icons";
import {useAppDispatch, useAppSelector} from "hooks/hooks";
import { modifyPassword } from "services/app/actions/userActions";
import { useNotifications } from "common/components/notifications";
import {Tooltip} from "../../../common/components/ui/tooltip/tooltip";
import {SSO_ADMIN_ROLE} from "../../../helpers/constants";
import {PageFooter} from "../../../common/components/ui/pagefooter/page-footer";

export const PasswordReset = () => {
  const navigate = useNavigate();
  const profile = useAppSelector(({ user }) => user.profile);
  const [password, setPassword] = useState('');
  const [confirmPassword,  setConfirmPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { keycloak } = useKeycloak();
  const dispatch = useAppDispatch();
  const { error } = useNotifications();
  const hasAdminRole = keycloak.tokenParsed?.realm_access?.roles.includes(SSO_ADMIN_ROLE);

  const validatePassword = useCallback(() => {
    const isPasswordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[-@#$!%*?&^])[A-Za-z\d-@#$!%*?&^]{8,}$/.test(password);

    setIsPasswordValid(isPasswordValid);
    return isPasswordValid;
  }, [password]);

  const validateConfirmPassword = useCallback(() => {
    const isConfirmPasswordValid = password === confirmPassword;

    setIsConfirmPasswordValid(isConfirmPasswordValid);
    return isConfirmPasswordValid;
  }, [password, confirmPassword]);

  const handleSubmit = useCallback(async () => {
    // eslint-disable-next-line
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();

    if(!isPasswordValid || !isConfirmPasswordValid) return;

    try {
      await dispatch(modifyPassword(password));
      keycloak.logout({ redirectUri: window.location.origin});
    }
    catch(err) {
      error(`Ошибка смены пароля: ${err}`);
    }
  }, [keycloak, password, dispatch, error, validatePassword, validateConfirmPassword]);

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
              Смена пароля
            </Typography>
          </Grid>
        </Grid>
      </Header>
      <div className={styles.page}>
        <Grid container spacing={2}>
          <Grid item sm={12}>
            <Tooltip content={<><h4>Пароль должен содержать:</h4><ul>
              <li>• заглавные и строчные;</li>
              <li>• спецсимволы: @#$%^&*-;</li>
              <li>• не менее 8 символов.</li>
            </ul></>}>
              <Input
                label={'Новый пароль'}
                value={password}
                isError={!isPasswordValid}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                  setIsPasswordValid(true);
                }}
                iconRight={<Icon component={showPassword ? Eye : EyeCrossed} onClick={() => setShowPassword(!showPassword)}/>}
                type={showPassword ? 'text' : 'password'}
                onBlur={() => validatePassword()}
              />
            </Tooltip>
            {!isPasswordValid && <div className={cs(styles.additionalText, {[styles.error]: !isPasswordValid })}>Заглавные, строчные и спецсимволы. Минимум 8.</div>}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item sm={12}>
            <Input
              label={'Подтверждение нового пароля'}
              value={confirmPassword}
              isError={!isConfirmPasswordValid}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setConfirmPassword(e.target.value);
                setIsConfirmPasswordValid(true);
              }}
              iconRight={<Icon component={showConfirmPassword ? Eye : EyeCrossed} onClick={() => setShowConfirmPassword(!showConfirmPassword)}/>}
              type={showConfirmPassword ? 'text' : 'password'}
              onBlur={() => validateConfirmPassword()}
            />
            {!isConfirmPasswordValid && <div className={cs(styles.additionalText, styles.error)}>Пароли не совпадают</div>}
          </Grid>
        </Grid>
        <Grid container spacing={2}  className={styles.buttons}>
          <Grid item sm={5}>
            <Button type="reset" variant="outlined" onClick={handleCancel} wide>
              Отмена
            </Button>
          </Grid>
          <Grid item sm={7}>
            <Button type="submit" onClick={handleSubmit} wide>
              Изменить пароль
            </Button>
          </Grid>
        </Grid>
        <div>После смены пароля автоматически будет выполнен выход из системы.</div>
      </div>
      <Footer>
        <PageFooter />
      </Footer>
    </>
  );
};
