import React, {FC, useEffect} from "react";
import { Button } from "common/components/ui/button";
import { Grid } from "common/components/ui/grid";
import { Input } from "common/components/ui/input";
import { InputController } from "common/components/ui/input-controller";
import { Typography } from "common/components/ui/typography";
import { useForm } from "react-hook-form";
import styles from "./agreement-form.module.scss";
import { AgreementDto } from "api/dto";
import { FileUpload } from "../../components/ui/file-upload";
import { Icon } from "../../components/ui/icon";
import { PDFIcon } from "../../icons";

export type AgreementFormInstance = Pick<AgreementDto, 'name' | 'version'> & { file: File };

type AgreementFormProps = {
  defaultValues?: Partial<AgreementFormInstance>
  submitButtonText?: string
  onSubmit(formInstance: AgreementFormInstance): void
  onCancel?(): void
};

export const AgreementForm: FC<AgreementFormProps> = ({ defaultValues, submitButtonText = 'Загрузить', onSubmit, onCancel }: AgreementFormProps) => {
  const {
    register,
    control,
    formState: { isDirty },
    handleSubmit,
    reset
  } = useForm<AgreementFormInstance>({
    defaultValues,
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "all",
    shouldFocusError: true,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.grid}>
        <Grid container spacing={2}>
          <Grid item>
            <Button disabled={!isDirty} type={isDirty ? 'submit' : undefined}>
              {submitButtonText}
            </Button>
          </Grid>
          <Grid item>
            <Button type="reset" variant="outlined" onClick={() => onCancel?.() || reset()}>
              Отмена
            </Button>
          </Grid>
        </Grid>
      </div>
      <InputController
        {...{
          control,
          register,
          name: "name",
          rules: {
            required: { value: true, message: 'Обязательное поле' },
          },
          render: (props: any) => (
            <Input
              label="Название согласия"
              className={styles.grid}
              {...props}
            />
          ),
        }}
      />
      <InputController
        {...{
          control,
          register,
          name: "version",
          rules: {
            required: { value: true, message: 'Обязательное поле' },
          },
          render: (props: any) => (
            <Input label="Версия" {...props} />
          ),
        }}
      />
      <InputController
        {...{
          control,
          register,
          name: "file",
          typeFile: true,
          rules: {
            required: { value: true, message: 'Обязательное поле' },
            validate: ( file: File | undefined ) => (file?.size || 0) / 1024 / 1024 < 2 || 'Размер файла должен быть меньше 2 Мб'
          },
          render: (props: any) => (
            <div className={styles.upload}>
              <FileUpload label="Загрузите файл" {...props} />
            </div>
          ),
        }}
      />
      <div className={styles.hint}>
        <Icon component={PDFIcon} />
        <Typography variant="body1" color={"#76767A"}>
          Формат: PDF<br/>Размер: не более 2 Мб
        </Typography>
      </div>
    </form>
  );
};
