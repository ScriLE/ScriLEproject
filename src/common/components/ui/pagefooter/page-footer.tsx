import React from "react";
import { Typography } from "../typography";

export const PageFooter = () => {
  return (
    <Typography variant="body1" color="#76767A" weight="400">
      2014-{(new Date()).getFullYear()} © Автономная некоммерческая организация «Институт развития
      интернета» (ИРИ).
    </Typography>
  );
};
