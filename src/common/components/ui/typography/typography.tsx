import { FC, ElementType, HTMLProps } from "react";
import cs from "classnames";
import styles from "./typography.module.scss";

type ComponentType = "span" | "p" | "div" | "a";
type Variant = "body1" | "body2" | "body3" | "body4";
type Transform = "uppercase" | "lowercase";

type Align = "left" | "center" | "right";

const alignMap: { [K in Align]: string } = {
  left: styles.alignLeft,
  right: styles.alignRight,
  center: styles.alignCenter,
};

const transformMap: { [K in Transform]: string } = {
  uppercase: styles.uppercase,
  lowercase: styles.lowercase,
};

const componentMap = {
  body1: "span",
  body2: "span",
  body3: "span",
  body4: "span",
} as Partial<{ [k in Variant]: ComponentType }>;

export type TypographyProps<C extends ElementType = ComponentType> = Omit<
  HTMLProps<C>,
  "color"
> & {
  component?: C;
  variant?: Variant;
  transform?: Transform;
  align?: Align;
  color?: string;
  weight?: string;
  fontSize?: number;
};

export const Typography: FC<TypographyProps> = ({
  variant,
  transform,
  component,
  color,
  align,
  weight,
  fontSize,
  className,
  style,
  children,
  ...rest
}) => {
  const classes = cs(
    variant && styles[variant],
    align && alignMap[align],
    transform && transformMap[transform],
    className
  );
  const colorText = color ? { color: `${color}` } : undefined;
  const size = !!fontSize ? { fontSize: `${fontSize}px` } : undefined;
  const fontWeight = !!weight ? { fontWeight: `${weight}` } : undefined;
  const currentStyles = { ...style, ...size, ...colorText, ...fontWeight };
  const variantType = variant || "body1";
  const Component = (
    component
      ? component
      : variantType in componentMap
      ? componentMap[variantType]
      : variant
  ) as ElementType;

  return (
    <Component className={classes} style={currentStyles} {...rest}>
      {children}
    </Component>
  );
};
