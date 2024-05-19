import cs from "classnames";
import styles from "./divider.module.scss";

type OrientationType = "horizontal" | "vertical";
type GapType = 0 | 1 | 2 | 3;

type Props = {
  orientation?: OrientationType;
  gap?: GapType;
  className?: string;
};

export const Divider = ({
  orientation = "horizontal",
  gap = 0,
  className,
}: Props) => {
  return (
    <div
      className={cs(
        className,
        styles.divider,
        styles[orientation],

        styles[`gap-${gap}`]
      )}
    />
  );
};
