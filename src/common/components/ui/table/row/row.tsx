import { FC, HTMLProps } from "react";
import styles from "./row.module.scss";
import cs from "classnames";

type Props = HTMLProps<HTMLTableRowElement> & {
  isSelect?: boolean;
};

export const Row: FC<Props> = ({ children, isSelect, ...rest }) => {
  return (
    <tr
      className={cs({
        [styles.select]: isSelect,
      })}
      {...rest}
    >
      {children}
    </tr>
  );
};
