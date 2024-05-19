import { FC, ReactNode } from "react";
import cs from "classnames";
import styles from "./container.module.scss";

type Props = {
  className?: string;
  children: ReactNode | JSX.Element;
};

export const Container: FC<Props> = ({ children, className }) => {
  return <div className={cs(styles.container, className)}>{children}</div>;
};
