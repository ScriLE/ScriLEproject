import {
  ClassAttributes,
  forwardRef,
  FunctionComponent,
  HTMLAttributes,
  ReactNode,
} from "react";
import Scrollbars from "react-custom-scrollbars-2";
import styles from "./scrollbar.module.scss";

type Props = {
  renderView?: FunctionComponent;
  children: ReactNode;
};

type PropsType = {
  props: JSX.IntrinsicAttributes &
    ClassAttributes<HTMLDivElement> &
    HTMLAttributes<HTMLDivElement>;
};

export const Scrollbar = forwardRef<any, Props>(
  ({ children, renderView }: Props, ref) => (
    <Scrollbars
      autoHide
      autoHideTimeout={1000}
      autoHideDuration={200}
      ref={ref}
      renderView={renderView}
      renderThumbVertical={(props: PropsType) => (
        <div {...props} className={styles.thumbVertical} />
      )}
      renderTrackVertical={(props: PropsType) => (
        <div {...props} className={styles.trackVertical} />
      )}
      renderThumbHorizontal={(props: PropsType) => (
        <div {...props} className={styles.thumbHorizontal} />
      )}
      renderTrackHorizontal={(props: PropsType) => (
        <div {...props} className={styles.trackHorizontal} />
      )}
    >
      {children}
    </Scrollbars>
  )
);
