import { FC } from "react";
import cs from "classnames";

type IconProps = React.SVGProps<SVGSVGElement> & {
  component: FC<React.SVGProps<SVGSVGElement>>;
  viewBox?: string;
  width?: number;
  height?: number;
  fill?: string;
  className?: string;
  title?: string
};

export const Icon: FC<IconProps> = ({
  width = 24,
  height: h,
  component,
  fill,
  viewBox = "0 0 24 24",
  className,
  ...rest
}) => {
  const BaseIcon = component;
  const height = h || width;

  return (
    <BaseIcon
      className={cs(className)}
      width={width && `${width}px`}
      height={height && `${height}px`}
      viewBox={viewBox}
      style={{ fill }}
      {...rest}
    />
  );
};
