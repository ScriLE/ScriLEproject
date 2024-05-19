import {useCallback, useEffect, useMemo, useState} from "react";
import cs from "classnames";
import styles from "./tabs.module.scss";

export type Props = {
  tabs: (string | JSX.Element)[];
  disabled?: boolean;
  disabledTab?: number;
  className?: string;
  activeTab?: number;
  children: (props: {
    activeTab: number;
    setActiveTab: (index: number) => () => void;
    getIsDisabledTabStatus: (index: number) => boolean;
  }) => JSX.Element;
};

export const Tabs = ({
  tabs,
  disabled = false,
  disabledTab,
  className,
  children,
  ...rest
}: Props) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    if(rest.activeTab === undefined) return;
    setActiveTab(rest.activeTab);
  }, [rest.activeTab]);

  const getIsDisabledTabStatus = useCallback(
    (index: number) => disabled || disabledTab === index,
    [disabled, disabledTab]
  );

  const handleChoiceTab = useCallback(
    (index: number) => () => {
      if (!getIsDisabledTabStatus(index)) {
        setActiveTab(index);
      }
    },
    [getIsDisabledTabStatus]
  );

  const tabsList = useMemo(
    () =>
      tabs.map((label, index) => (
        <li
          key={index}
          className={cs(styles.tab, {
            [styles.active]: index === activeTab,
            [styles.disabled]: getIsDisabledTabStatus(index),
          })}
          onClick={handleChoiceTab(index)}
        >
          {label}
        </li>
      )),
    [handleChoiceTab, getIsDisabledTabStatus, tabs, activeTab]
  );

  return (
    <>
      <ul className={cs(styles.tabs, className)}>{tabsList}</ul>
      {children({
        activeTab,
        setActiveTab: handleChoiceTab,
        getIsDisabledTabStatus,
      })}
    </>
  );
};
