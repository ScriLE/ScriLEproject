import styles from "./phone-input.module.scss";
import cs from "classnames";
import {ChangeEvent, ForwardedRef, forwardRef, useEffect, useState} from "react";
import InputMask from 'react-input-mask';

const PHONE_MASK = '+7 (999) 999-99-99';

export const PhoneInput = forwardRef(({
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
  type
}: any, ref: ForwardedRef<HTMLInputElement>) => {
  const [value, setValue] = useState(valueProp || "");

  useEffect(() => {
    setValue(valueProp);
  }, [valueProp]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange && onChange({ target: {
      value: e.target.value?.replaceAll(/\s|-|_|\(|\)/g, '') || ''
    }});
  }

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
        <InputMask
          inputRef={ref}
          name={name}
          className={styles.input}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleChange}
          value={value}
          type={type || "text"}
          mask={PHONE_MASK}/>
        {iconRight && <span className={styles.iconRight}>{iconRight}</span>}
      </div>
      <div className={styles.errorMessage}>{errors?.[name] ? <>{errors[name]?.message}</> : <></>}</div>
    </div>
  );
});
