import cs from "classnames";
import { ArrowDown, Exit, Person } from "common/icons";
import {ReactNode, useEffect} from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "../ui/icon";
import { Typography } from "../ui/typography";
import styles from "./header.module.scss";
import {useAppDispatch, useAppSelector} from "hooks/hooks";
import {useKeycloak} from "@react-keycloak/web";
import {fetchProfile} from "services/app/actions/userActions";

type Props = {
  className?: string;
  children?: JSX.Element | ReactNode;
  hideProfile?: boolean;
};

export const Header = ({ className, children, hideProfile }: Props) => {
  const dispatch = useAppDispatch();
  const { keycloak } = useKeycloak();
  const profile = useAppSelector(({ user }) => user.profile );

  useEffect(() => {
    if(!keycloak?.authenticated || profile.email) return;
    (async () => {
      await dispatch(fetchProfile());
    })();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [keycloak, dispatch]);

  return (
    <header className={cs(styles.header, className)}>
      <div className={styles.headerContent}>{children}</div>
      {!hideProfile && <div className={styles.actions}>
        <div className={styles.dropdown}>
          <div className={styles.headerUser}>
            <Icon component={Person} className={styles.iconUser} width={24} />
            <Typography variant="body2">{profile?.lastName || ''} {profile?.firstName || ''}</Typography>
            <Icon
              component={ArrowDown}
              className={styles.iconDropdown}
              width={24}
              fill="var(--bg-dark-color)"
            />
          </div>
          <div className={styles.dropdownBlock}>
            <NavLink to="/profile" className={styles.dropdownLink}>
              Профиль
            </NavLink>
            {profile.ldapUser ? <Typography className={styles.disabledLink}>Смена e-mail</Typography> : <NavLink to="/edit-email" className={styles.dropdownLink}>
              Смена e-mail
            </NavLink>}
            {profile.ldapUser ? <Typography className={styles.disabledLink}>Смена пароля</Typography> : <NavLink to="/edit-password" className={styles.dropdownLink}>
              Смена пароля
            </NavLink>}
          </div>
        </div>
        <Icon
          component={Exit}
          className={styles.iconExit}
          width={24}
          onClick={() => keycloak.logout({ redirectUri: window.location.origin + '/' })}
        />
      </div>}
    </header>
  );
};
