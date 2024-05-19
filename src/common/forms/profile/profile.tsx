import React, {useEffect} from "react";
import { Button } from "common/components/ui/button";
import { Grid } from "common/components/ui/grid";
import { Input } from "common/components/ui/input";
import { InputController } from "common/components/ui/input-controller";
import { useForm } from "react-hook-form";
import styles from "./profile-form.module.scss";
import {PhoneInput} from "../../components/ui/phone-input";
import {Tooltip} from "../../components/ui/tooltip/tooltip";

export type ProfileFormInstance = Profile;

type ProfileFormProps = {
  defaultValues?: Partial<ProfileFormInstance>
  submitButtonText?: string
  onSubmit(formInstance: ProfileFormInstance): void
  onCancel?(): void
};

export const ProfileForm = ({ defaultValues, submitButtonText = 'Сохранить изменения', onSubmit, onCancel }: ProfileFormProps) => {
  const {
    register,
    control,
    formState: { isDirty },
    handleSubmit,
    reset
  } = useForm<ProfileFormInstance>({
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
      <InputController
        {...{
          control,
          register,
          name: "lastName",
          rules: {
            required: { value: true, message: 'Обязательное поле' },
            pattern: {
              value: /^[а-яА-Я-ё]{1,50}$/,
              message: 'Требования к фамилии не выполнены',
            }
          },
          render: (props: any) => (
            <Tooltip className={styles.grid} content={<><h4>Не допускается использование латиницы, специальных символов и пробелов</h4></>}>
              <Input
                label="Фамилия"
                {...props}
              />
            </Tooltip>
          ),
        }}
      />
      <InputController
        {...{
          control,
          register,
          name: "firstName",
          rules: {
            required: { value: true, message: 'Обязательное поле' },
            pattern: {
              value: /^[а-яА-Я-ё]{1,50}$/,
              message: 'Требования к имени не выполнены',
            }
          },
          render: (props: any) => (
            <Tooltip className={styles.grid} content={<><h4>Не допускается использование латиницы, специальных символов и пробелов</h4></>}>
              <Input
                label="Имя"
                {...props}
              />
            </Tooltip>
          ),
        }}
      />
      <InputController
        {...{
          control,
          register,
          name: "patrName",
          rules: {
            required: false,
            pattern: {
              value: /^[а-яА-Я-ё]{1,50}$/,
              message: 'Требования к отчеству не выполнены',
            }
          },
          render: (props: any) => (
            <Tooltip className={styles.grid} content={<><h4>Не допускается использование латиницы, специальных символов и пробелов</h4></>}>
              <Input
                label="Отчество"
                {...props}
              />
            </Tooltip>
          ),
        }}
      />
      <InputController
        {...{
          control,
          register,
          name: "phone",
          rules: {
            required: { value: true, message: 'Обязательное поле' },
            pattern: {
              value: /^\+7[3-5,8-9]\d{9}$/,
              message: 'Требования к телефону не выполнены',
            }
          },
          render: (props: any) => (
            <Tooltip className={styles.grid} content={<><h4>Номер телефона в формате +7 (900) 000-00-00</h4></>}>
              <PhoneInput
                label="Телефон"
                {...props}
              />
            </Tooltip>
          ),
        }}
      />
      <InputController
        {...{
          control,
          register,
          name: "telegram",
          rules: {
            required: false,
            pattern: {
              value: /^[a-zA-Z\d_]{5,32}$/,
              message: 'Требования к telegram не выполнены',
            }
          },
          render: (props: any) => (
            <Tooltip className={styles.grid} content={<><h4>Идентификатор пользователя без @ в начале</h4></>}>
              <Input
                label="Telegram"
                {...props}
              />
            </Tooltip>
          ),
        }}
      />
      <div className={styles.grid}>
        <Grid container spacing={2}>
          <Grid item>
            <Button type="reset" variant="outlined" onClick={() => onCancel?.() || reset()}>
              Отмена
            </Button>
          </Grid>
          <Grid item>
            <Button disabled={!isDirty} type={isDirty ? 'submit' : undefined}>
              {submitButtonText}
            </Button>
          </Grid>
        </Grid>
      </div>
    </form>
  );
};
