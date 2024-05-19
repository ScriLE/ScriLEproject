import { useFormState, useWatch } from "react-hook-form";

export const InputController = ({
  control,
  register,
  name,
  rules,
  render,
  defaultValue,
  typeFile = false
}: any) => {
  const value = useWatch({
    control,
    name,
    defaultValue
  });
  const { errors } = useFormState({
    control,
    name,
  });
  const props = register(name, rules);

  return render({
    value: value || '',
    errors,
    isError: !!errors[name],
    isRequired: !!rules.required?.value || !!rules.required,
    onChange: (e) => {
      props.onChange({
        ...e,
        target: {
          name,
          value: typeFile ? e.target.files?.[0] : e.target.value,
        },
      })
    },
    onBlur: props.onBlur,
    name: props.name,
    ref: props.ref,
  });
};
