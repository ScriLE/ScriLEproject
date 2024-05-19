import { ArrowDown, ArrowUp } from "common/icons";
import { ElementType, FC, HTMLProps } from "react";
import { Icon } from "../../icon";
import styles from "./cell.module.scss";

type Component = "td" | "th";

type Props<C extends ElementType = Component> =
  HTMLProps<HTMLTableCellElement> & {
    name?: string
    component?: C;
    isSortable?: boolean;
    widthCell?: number;
    handleClick?: (sortingOrder: string) => void;
  };

export const Cell: FC<Props> = ({
  component: Component = "td",
  children,
  isSortable = false,
  widthCell,
  handleClick,
  name,
  ...rest
}) => (
  <Component width={widthCell && `${widthCell}px`} {...rest}>
    <div>
      <div className={styles.cell}>
        {children}{" "}
        {isSortable && (
          <div className={styles.sortable}>
            <Icon
              component={ArrowUp}
              className={styles.icon}
              width={16}
              onClick={() => handleClick?.(name || '')}
            />
            <Icon
              component={ArrowDown}
              className={styles.icon}
              width={16}
              onClick={() => handleClick?.(`~${name}`)}
            />
          </div>
        )}
      </div>
    </div>
  </Component>
);
