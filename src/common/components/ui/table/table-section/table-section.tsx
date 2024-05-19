import { ElementType, FC, HTMLProps } from "react";

type Component = "tbody" | "thead";

type Props<C extends ElementType = Component> =
  HTMLProps<HTMLTableSectionElement> & {
    component?: C;
  };

export const TableSection: FC<Props> = ({
  component: Component = "tbody",
  children,
  ...rest
}) => {
  return <Component {...rest}>{children}</Component>;
};
