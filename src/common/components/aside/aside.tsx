import cs from "classnames";
import Logo from "common/images/logo-small.svg";
import styles from "./aside.module.scss";
import {Link, NavLink, useLocation} from "react-router-dom";
import { Icon } from "../ui/icon";
import {Handshake, ListAlt, Users} from "common/icons";

type Props = {
  className?: string;
};

export const Aside = ({ className }: Props) => {
  const location = useLocation();

  return (
    <aside className={cs(styles.aside, className)}>
      <Link className={styles.logo} to={'/admin'}>
        <img src={Logo} alt="logo iri" />
      </Link>
      <div className={styles.nav}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <NavLink className={cs(styles.navLink, { [styles.activeLink]: !/.*(agreements|users).*/.test(location.pathname) })} to="/admin">
              <Icon component={ListAlt} className={styles.navIcon} width={24} />
              <div className={styles.navText}>Системы</div>
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink className={cs(styles.navLink, { [styles.activeLink]: location.pathname.includes('agreements') })} to="/admin/agreements">
              <Icon
                component={Handshake}
                className={styles.navIcon}
                width={24}
              />
              <div className={styles.navText}>Согласия</div>
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink className={cs(styles.navLink, { [styles.activeLink]: location.pathname.includes('users') })} to="/admin/users">
              <Icon
                component={Users}
                className={styles.navIcon}
                width={24}
              />
              <div className={styles.navText}>Пользователи</div>
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
};
