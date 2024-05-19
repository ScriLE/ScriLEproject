export const customStyles = (isSmall: boolean, isDisabled?: boolean) => ({
  control: (styles: any) => ({
    ...styles,
    backgroundColor: isDisabled ? "var(--bg-main-color)" : "var(--white-color)",
    width: "100%",
    height: isSmall ? "30px" : "40px",
    minHeight: isSmall ? "30px" : "38px",
    borderRadius: "var(--border-radius)",
    borderColor: isDisabled
      ? "var(--bg-main-color)  !important"
      : "var(--disabled-color) !important",
    boxShadow: "none",
    fontSize: isSmall ? "14px" : "16px",
    lineHeight: isSmall ? "20px" : "22px",
    cursor: isDisabled ? "default" : "pointer",
  }),

  option: (styles: any, { isSelected }: any) => {
    return {
      ...styles,
      backgroundColor: isSelected
        ? "var(--outlined-color)  !important"
        : "var(--white-color) !important",
      color: "var(--black-color)",
      height: "38px",
      marginBottom: "calc(var(--gap) * 2)",
      cursor: "pointer",
    };
  },
  menu: (styles: any) => ({
    ...styles,
    width: "100%",
    margin: 0,
    transform: "translateX(3px)",
    padding: "calc(var(--gap) * 2)",
    zIndex: "5",
  }),
  menuList: (styles: any) => ({
    ...styles,
    paddingRight: "calc(var(--gap) * 2)",
    "::-webkit-scrollbar": {
      width: "8px",
      height: "0px",
    },
    "::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "::-webkit-scrollbar-thumb": {
      background: "var(--main-lightest-color)",
      borderRadius: "8px",
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: "var(--main-lightest-color)",
    },
  }),
  input: (styles: any) => ({ ...styles }),
  placeholder: (styles: any) => ({
    ...styles,
    color: "var(--placeholder-color)",
  }),
  indicatorSeparator: (styles: any) => ({ ...styles, display: "none" }),
  indicatorsContainer: (styles: any) => ({
    ...styles,
    height: "100%",
    display: isDisabled ? "none" : "flex",
    "&>div": {
      padding: "0px 9px",
    },
  }),
  valueContainer: (styles: any) => ({
    ...styles,
    padding: "0px 12px",
    transform: isSmall ? "translateY(0px)" : "translateY(6px)",
  }),
});
