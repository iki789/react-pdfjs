import React from "react";
import "./button.css";

const Button: React.SFC<ButtonProps> = props => {
  const classes: string[] = ["btn"];
  if (props.icon) {
    classes.push("btn-icon");
  }
  return (
    <button className={classes.join(" ")} {...props}>
      {props.children}
    </button>
  );
};

export default Button;

interface ButtonProps {
  icon?: boolean;
}
