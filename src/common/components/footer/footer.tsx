import cs from "classnames";
import { ReactNode } from "react";
import styles from "./footer.module.scss";

type Props = {
  className?: string;
  children?: JSX.Element | ReactNode;
};

export const Footer = ({ className, children }: Props) => {
  return (
    <header className={cs(styles.footer, className)}>
      <div className={styles.footerContent}>{children}</div>
    </header>
  );
};
