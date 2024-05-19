import { FC, CSSProperties, ReactNode } from "react";
import cs from "classnames";
import styles from "./tab-content.module.scss";

type Props = {
  tabIndex: number;
  activeTab: { activeTab: number };
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};
export const TabContent: FC<Props> = ({
  tabIndex,
  activeTab,
  className,
  style,
  children,
}) => {
  return (
    <div
      className={cs(styles.tabs, className, {
        [styles.active]: tabIndex === activeTab.activeTab,
      })}
      style={style}
    >
      {children}
    </div>
  );
};
