import { FC, HTMLProps } from "react";
import cs from "classnames";
import "./grid.scss";

type GridDirection = "row" | "row-reverse" | "column" | "column-reverse";

type GridWrap = "nowrap" | "wrap" | "wrap-reverse";

type GridJustification =
  | "flex-start"
  | "center"
  | "flex-end"
  | "space-between"
  | "space-around"
  | "space-evenly";

type GridItemsAlignment =
  | "flex-start"
  | "center"
  | "flex-end"
  | "stretch"
  | "baseline";

type GridContentAlignment =
  | "stretch"
  | "center"
  | "flex-start"
  | "flex-end"
  | "space-between"
  | "space-around";

type Spacing =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16;

type GridSpacing = Record<
  "spacing" | "spacingSm" | "spacingMd" | "spacingLg" | "spacingXl",
  Spacing
>;

type Size = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

type GridSize = Record<"xs" | "sm" | "md" | "lg" | "xl", Size>;

type Props = HTMLProps<HTMLDivElement> &
  Partial<GridSpacing> &
  Partial<GridSize> & {
    container?: boolean;
    item?: boolean;
    direction?: GridDirection;
    wrap?: GridWrap;
    justify?: GridJustification;
    alignItems?: GridItemsAlignment;
    alignContent?: GridContentAlignment;
    hidden?: boolean;
  };

export const Grid: FC<Props> = ({
  container,
  item,
  direction,
  wrap,
  justify,
  alignItems,
  alignContent,
  xs,
  sm,
  md,
  lg,
  xl,
  spacing,
  spacingSm,
  spacingMd,
  spacingLg,
  spacingXl,
  hidden,
  className,
  children,
  ...rest
}) => {
  if (container) {
    const classes = cs(
      "grid-container",
      {
        [`direction-${direction}`]: direction,
        [`wrap-${wrap}`]: wrap,
        [`justify-${justify}`]: justify,
        [`align-items-${alignItems}`]: alignItems,
        [`align-content-${alignContent}`]: alignContent,
        [`spacing-xs-${spacing}`]: spacing,
        [`spacing-sm-${spacingSm}`]: spacingSm,
        [`spacing-md-${spacingMd}`]: spacingMd,
        [`spacing-lg-${spacingLg}`]: spacingLg,
        [`spacing-xl-${spacingXl}`]: spacingXl,
        hidden,
      },
      className
    );

    return (
      <div className={classes} {...rest}>
        {children}
      </div>
    );
  }

  if (item) {
    const classes = cs(
      "grid-item",
      {
        [`size-xs-${xs}`]: xs,
        [`size-sm-${sm}`]: sm,
        [`size-md-${md}`]: md,
        [`size-lg-${lg}`]: lg,
        [`size-xl-${xl}`]: xl,
        hidden,
      },
      className
    );

    return (
      <div className={classes} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <div className={cs(className, { hidden })} {...rest}>
      {children}
    </div>
  );
};
