import React, { FC, ReactNode } from "react";
import styles from "./dialog.module.scss";
import {Button} from "../button";

export type DialogProps = {
  visible: boolean;
  children: ReactNode
  submitButtonText?: string
  cancelButtonText?: string
  onSubmit(): void
  onClose(): void
};

export const Dialog: FC<DialogProps> = ({
  visible,
  children,
  submitButtonText = 'Продолжить',
  cancelButtonText = 'Отмена',
  onClose,
  onSubmit
}) => {

  if(!visible) return null;

  return (
    <div className={styles.backdrop}  >
      <div className={styles.dialog}>
        <div className={styles.content}>
          {children}
        </div>
        <div className={styles.footer} >
          <Button type="reset" variant="outlined" onClick={onClose}>
            {cancelButtonText}
          </Button>
          <Button type="submit" onClick={onSubmit}>
            {submitButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
};
