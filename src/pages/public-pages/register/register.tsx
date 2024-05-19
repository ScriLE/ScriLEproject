import { FormWrapper } from "common/components/form-wrapper/inddex";
import { Button } from "common/components/ui/button";
import { Divider } from "common/components/ui/divider";
import { Grid } from "common/components/ui/grid";
import { Icon } from "common/components/ui/icon";
import { Input } from "common/components/ui/input";
import { InputController } from "common/components/ui/input-controller";
import { Typography } from "common/components/ui/typography";
import { EyeCrossed } from "common/icons";
import styles from "./register.module.scss";
import { useForm } from "react-hook-form";

export const Register = () => {
  const {
    register,
    control,
    formState: { errors, isDirty, isValid },
    handleSubmit,
  } = useForm({ mode: "onBlur" });

  const onSubmit = (data: any) => console.log(data);

  return (
    <FormWrapper>
      <Grid container spacing={2}>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
          <Typography variant="body2">Регистрация</Typography>
          <Divider />
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={2}></Grid>
          <Grid item xs={4}>
            <InputController
              {...{
                control,
                register,
                name: "mail",
                rules: {
                  required: true,
                },
                render: (props: any) => (
                  <Input label="E-mail:" className={styles.grid} {...props} />
                ),
              }}
            />

            <InputController
              {...{
                control,
                register,
                name: "password",
                rules: {
                  required: true,
                },
                render: (props: any) => (
                  <Input
                    type="password"
                    label="Пароль:"
                    className={styles.grid}
                    {...props}
                    icon={<Icon component={EyeCrossed} />}
                  />
                ),
              }}
            />
            <InputController
              {...{
                control,
                register,
                name: "confirmPassword",
                rules: {
                  required: true,
                },
                render: (props: any) => (
                  <Input
                    type="password"
                    label="Повторите пароль:"
                    className={styles.grid}
                    {...props}
                    icon={<Icon component={EyeCrossed} />}
                  />
                ),
              }}
            />
            <label>
              <div>Согласен на обработку персональных данных:</div>
              <input
                type="checkbox"
                {...register("agreement", { required: true })}
              />
              <div>{errors?.agreement ? <>Обязательное поле</> : <></>}</div>
            </label>
          </Grid>
          <Grid item xs={4}>
            <InputController
              {...{
                control,
                register,
                name: "surname",
                rules: {
                  required: true,
                },
                render: (props: any) => (
                  <Input label="Фамилия:" className={styles.grid} {...props} />
                ),
              }}
            />
            <InputController
              {...{
                control,
                register,
                name: "name",
                rules: {
                  required: true,
                },
                render: (props: any) => (
                  <Input label="Имя:" className={styles.grid} {...props} />
                ),
              }}
            />

            <InputController
              {...{
                control,
                register,
                name: "middleName",
                render: (props: any) => (
                  <Input label="Отчество:" className={styles.grid} {...props} />
                ),
              }}
            />

            <InputController
              {...{
                control,
                register,
                name: "phone",
                rules: {
                  required: true,
                },
                render: (props: any) => (
                  <Input label="Телефон:" className={styles.grid} {...props} />
                ),
              }}
            />
            <Button
              type={"submit"}
              wide
              disabled={!isDirty || !isValid}
              className={styles.grid}
            >
              Зарегистрироваться
            </Button>
            <Typography
              variant="body1"
              align={"center"}
              className={styles.link}
            >
              Есть аккаунт? <Button variant={"text"}>Войти</Button>
            </Typography>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
      </form>
    </FormWrapper>
  );
};
