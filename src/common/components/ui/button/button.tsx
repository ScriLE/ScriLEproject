import { FC, ButtonHTMLAttributes, ReactNode } from "react";
import classNames from "classnames";
import styles from "./button.module.scss";

type Variants = "primary" | "alert"| "alert-outlined" | "outlined" | "text";
type Size = "small" | "medium";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variants;
  size?: Size;
  active?: boolean;
  wide?: boolean;
  icon?: ReactNode | JSX.Element;
  type?: string;
  ref?: any;
  onClick?: () => void;
};

export const Button: FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  type = "button",
  active,
  disabled,
  wide,
  className,
  icon,
  onClick,
  children,
  ref,
  ...rest
}) => {
  const style = classNames(
    styles.button,
    styles[variant],
    styles[size],
    className,
    {
      [styles.active]: active,
      [styles.disabled]: disabled,
      [styles.wide]: wide,
    }
  );

  const handleClick = () => {
    if (!disabled && !active && onClick) onClick();
  };

  return (
    <button
      ref={ref}
      className={style}
      onClick={handleClick}
      type={type}
      {...rest}
    >
      {icon && <span className={styles.iconButton}>{icon}</span>}
      {children}
    </button>
  );
};
