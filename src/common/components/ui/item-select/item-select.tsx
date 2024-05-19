import ReactSelect from "react-select";
import cs from "classnames";
import styles from "./item-select.module.scss";
import { customStyles } from "./styles";
import { useEffect, useRef, useState } from "react";

type Props = {
  options: any;
  defaultValue?: any;
  className?: string;
  disabled?: boolean;
  isSmall?: boolean;
  label?: string;
  isMulti?: boolean;
  onGetValue?: (val: any) => void;
};

export const ItemSelect = ({
  options,
  defaultValue,
  className,
  disabled = false,
  isSmall = false,
  isMulti = false,
  label,
  onGetValue,
}: Props) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [isValue, setIsValue] = useState<boolean>(false);
  const [isOpenOptiopns, setIsOpenOptiopns] = useState<boolean>(false);
  const ref = useRef<any>(null);

  useEffect(() => {
    if (ref.current.getValue().length === 0) return;
    setIsFocus(true);
  }, []);
  return (
    <div
      className={cs(styles.reactSelect, className, {
        [styles.focus]: isFocus,
        [styles.small]: isSmall,
      })}
    >
      {label?.length !== 0 ? (
        <div
          className={styles.selectLabel}
          onClick={() => {
            ref?.current?.focus();
          }}
        >
          {label}
        </div>
      ) : null}
      <ReactSelect
        ref={ref}
        options={options}
        defaultValue={defaultValue}
        placeholder={""}
        isDisabled={disabled}
        menuPlacement="auto"
        isMulti={isMulti}
        menuIsOpen={isOpenOptiopns}
        onChange={(choice) => {
          setIsValue(true);
          setIsOpenOptiopns(false);
          onGetValue && onGetValue(choice.label);
        }}
        onFocus={() => {
          setIsFocus(true);
          setIsOpenOptiopns(true);
        }}
        onBlur={() => {
          setIsOpenOptiopns(false);
          isValue ? setIsFocus(true) : setIsFocus(false);
        }}
        styles={customStyles(Boolean(isSmall), disabled)}
      />
    </div>
  );
};
