import React, {useEffect} from "react";
import { Button } from "common/components/ui/button";
import { Grid } from "common/components/ui/grid";
import { Input } from "common/components/ui/input";
import { InputController } from "common/components/ui/input-controller";
import { Typography } from "common/components/ui/typography";
import { useForm } from "react-hook-form";
import styles from "./system-form.module.scss";
import { SystemDto } from "api/dto/SystemDto";

export type SystemFormInstance = Pick<SystemDto, 'name' | 'url' | 'logoUrl' | 'kcClient'>;

type SystemFormProps = {
  defaultValues?: Partial<SystemFormInstance>
  submitButtonText?: string
  loading?: boolean
  onSubmit(formInstance: SystemFormInstance): void
  onCancel?(): void
};

export const  SystemForm = ({ defaultValues, submitButtonText = 'Сохранить', onSubmit, onCancel }: SystemFormProps) => {
  const {
    register,
    control,
    formState: { isDirty },
    handleSubmit,
    reset
  } = useForm<SystemFormInstance>({
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
            <Button disabled={!isDirty} type={isDirty ? 'submit' : undefined} >
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
              label="Название системы"
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
          name: "kcClient",
          rules: {
            required: { value: true, message: 'Обязательное поле' },
          },
          render: (props: any) => (
            <Input
              label="Идентификатор системы в Keycloak"
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
          name: "url",
          rules: {
            required: { value: true, message: 'Обязательное поле' },
          },
          render: (props: any) => (
            <Input
              label="URL системы"
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
          name: "logoUrl",
          rules: {
            required: false,
          },
          render: (props: any) => (
            <Input label="URL логотипа" {...props} />
          ),
        }}
      />
      <Typography variant="body1" color={"#76767A"}>
        Допустимый формат файла: png, jpg. Размер файла 150 х 150 px.
      </Typography>
    </form>
  );
};
