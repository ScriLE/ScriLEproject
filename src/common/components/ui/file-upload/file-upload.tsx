import styles from "./file-upload.module.scss";
import cs from "classnames";
import { useRef, useState } from "react";
import { Button } from "../button";

export const FileUpload = ({
  name,
  label,
  className,
  disabled,
  onChange,
  isError,
  errors,
  accept = 'application/pdf'
}: any) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [filename, setFilename] = useState<string>();

  return (
    <div
      className={cs(
        styles.inputWrapper,
        {
          [styles.disabled]: disabled,
          [styles.error]: isError,
        },
        className
      )}
    >
      {label ? <div className={styles.inputLabel}>{label}</div> : null}

      <div className={styles.inputField}>
        <Button onClick={() => inputRef.current?.click()} >Выберите файл</Button>
        <span className={cs(styles.filename, { [styles.errorMessage]: !!errors[name] })}>
          {errors[name]?.message || (filename ? filename : 'Файл не выбран')}
        </span>
        <input
          ref={inputRef}
          type={'file'}
          accept={accept}
          name={name}
          className={styles.input}
          disabled={disabled}
          onChange={(e) => {
            setFilename(e.target.files?.[0].name);

            // TODO check file size

            onChange && onChange(e);
          }}
        />
      </div>

    </div>
  );
};
