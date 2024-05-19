import { ReactNode } from "react";
import Logo from "common/images/logo.svg";
import styles from "./form-wrapper.module.scss";
import { Typography } from "../ui/typography";
import {PageFooter} from "../ui/pagefooter/page-footer";

type Props = {
  children: ReactNode | JSX.Element;
};

export const FormWrapper = ({ children }: Props) => {
  return (
    <div className={styles.formWapper}>
      <div className={styles.formHead}>
        <img src={Logo} alt="logo" className={styles.formLogo} />
      </div>
      <div className={styles.formBody}>{children}</div>
      <div className={styles.formFooter}>
        <PageFooter />
      </div>
    </div>
  );
};
