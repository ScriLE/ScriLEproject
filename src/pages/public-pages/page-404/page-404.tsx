import {Grid} from "common/components/ui/grid";
import {Footer} from "common/components/footer";
import {Typography} from "common/components/ui/typography";
import Logo from "common/images/logo.svg";
import { Header } from "common/components/header";
import styles from './page-404.module.scss';
import {Link} from "react-router-dom";
import {Button} from "common/components/ui/button";
import {PageFooter} from "../../../common/components/ui/pagefooter/page-footer";
import {ReactComponent as Spinner} from "../../../common/images/spinner.svg";
import React from "react";
import {useKeycloak} from "@react-keycloak/web";

export const Page404 = () => {
  const { initialized, keycloak } = useKeycloak();

  if(!keycloak || !initialized) return <div className={styles.loaderBackdrop}>
    <Spinner />
  </div>;

  return <>
    <Header hideProfile>
      <Grid container spacing={2}>
        <Grid item>
          <img src={Logo} alt="logo iri" />
        </Grid>
      </Grid>
    </Header>
    <div className={styles.wrapper}>
      <div className={styles.content} >
        <h1 >
          Ошибка 404
        </h1>
        <Typography variant="body1" weight="400">
          Страница не найдена.
        </Typography>
        <div className={styles.action}>
          <Link to="/">
            <Button >На главную</Button>
          </Link>
        </div>
      </div>
    </div>
    <Footer>
      <PageFooter />
    </Footer>
  </>;
};