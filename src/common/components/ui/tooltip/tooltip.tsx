import React, {FC, useState} from "react";
import styles from './tooltip.module.scss';
import {TooltipPointer} from "../../../icons";
import cs from "classnames";

type TooltipProps = {
  children: React.ReactNode,
  content: React.ReactNode,
  className?: string
}

export const Tooltip: FC<TooltipProps> = ({ className, children, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (<div
      className={cs(styles.tooltipWrapper, className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && <><div className={styles.tooltip} ><TooltipPointer />{content}</div></>}
    </div>);
};