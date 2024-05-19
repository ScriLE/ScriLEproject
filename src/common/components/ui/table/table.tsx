import { HTMLProps, ReactNode } from "react";
import cs from "classnames";
import styles from "./table.module.scss";

type Props = HTMLProps<HTMLTableElement> & {
  children: ReactNode;
  variant?: "standart" | "formTable" | "grayTable" | "whiteTable";
  className?: string;
};

export const Table = ({
  children,
  className,
  variant = "standart",
  ...rest
}: Props) => (
  <div
    className={cs(styles.tableWrapper, className, {
      [styles["formTable"]]: variant === "formTable",
      [styles["grayTable"]]: variant === "grayTable",
      [styles["whiteTable"]]: variant === "whiteTable",
    })}
  >
    <table className={cs(styles.table)} {...rest}>
      {children}
    </table>
  </div>
);
