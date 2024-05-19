import React from "react";
import { components as selectComponents } from "react-select";

export const ValueContainer: any["ValueContainer"] = ({
  label,
  ...props
}: any) => {
  const children = props.children as [
    React.ReactNode[] | React.ReactNode,
    React.ReactNode
  ];
  return (
    <selectComponents.ValueContainer {...props}>
      {label}
      {children}
    </selectComponents.ValueContainer>
  );
};
