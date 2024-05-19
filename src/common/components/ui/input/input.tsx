import styles from "./input.module.scss";
import cs from "classnames";
import {ForwardedRef, forwardRef, useEffect, useState} from "react";

export const Input = forwardRef(({
  name,
  label,
  className,
  disabled,
  placeholder,
  onChange,
  isRequired,
  isError,
  iconLeft,
  iconRight,
  isSmall,
  value: valueProp,
  errors,
  type,
  onKeyDown,
  ...rest
}: any, ref: ForwardedRef<HTMLInputElement>) => {
  const [value, setValue] = useState(valueProp || "");
  useEffect(() => {
    setValue(valueProp);
  }, [valueProp]);
  return (
    <div
      className={cs(
        styles.inputWrapper,
        {
          [styles.disabled]: disabled,
          [styles.error]: isError,
          [styles.small]: isSmall,
        },
        className
      )}
    >
      {label ? <div className={cs(
        styles.inputLabel,
        { [styles.required]: isRequired },
      )}>{label}</div> : null}

      <div className={styles.inputField}>
        {iconLeft && <span className={styles.iconLeft}>{iconLeft}</span>}
        <input
          ref={ref}
          name={name}
          className={styles.input}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => {
            setValue(e.target.value);
            onChange && onChange(e);
          }}
          value={value}
          type={type || "text"}
          onKeyDown={onKeyDown}
          {...rest}
        />
        {iconRight && <span className={styles.iconRight}>{iconRight}</span>}
      </div>
      <div className={styles.errorMessage}>{errors?.[name] ? <>{errors[name]?.message}</> : <></>}</div>
    </div>
  );
});
