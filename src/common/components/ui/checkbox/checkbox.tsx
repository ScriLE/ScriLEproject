import {
  ChangeEvent,
  FC,
  InputHTMLAttributes,
  ReactNode,
  SVGProps,
} from "react";
import cs from "classnames";
import styles from "./checkbox.module.scss";
import { CheckboxOn, CheckboxOff } from "common/icons";
import { Typography } from "common/components/ui/typography";
import { Icon } from "common/components/ui/icon";

type CheckboxType = "checkbox";

export type CheckBoxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "onClick" | "value" | "type"
> & {
  value?: boolean | null;
  type?: CheckboxType;
  label?: JSX.Element | ReactNode;
  onChange?: (value: boolean) => void;
};

type IconsMapType = {
  [K in CheckboxType]: {
    [SK in "on" | "off"]: FC<SVGProps<SVGSVGElement>>;
  };
};

const ICONS_MAP: IconsMapType = {
  checkbox: {
    on: CheckboxOn,
    off: CheckboxOff,
  },
};

export const Checkbox: FC<CheckBoxProps> = ({
  name,
  value,
  label,
  disabled,
  className,
  onChange,
  checked,
  type = "checkbox",
  ...rest
}) => {
  const handleChecked = (event: ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;
    onChange(event.currentTarget.checked);
  };

  return (
    <label
      className={cs(
        styles.checkBox,
        { [styles.disabled]: disabled },
        className
      )}
      htmlFor={name}
    >
      <Icon
        width={16}
        viewBox="0 0 16 16"
        className={styles.icon}
        component={value ? ICONS_MAP[type].on : ICONS_MAP[type].off}
      />
      <Typography variant="body1">{label}</Typography>
      <input
        id={name}
        name={name}
        checked={checked ? checked : !!value}
        type="checkbox"
        onChange={handleChecked}
        disabled={disabled}
        hidden
        {...rest}
      />
    </label>
  );
};
