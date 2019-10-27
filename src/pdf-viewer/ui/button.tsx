import React from "react";
import "./button.css";

const Button: React.SFC<ButtonProps> = props => {
  return (
    <button className="btn" {...props}>
      {props.children}
    </button>
  );
};

export default Button;

interface ButtonProps {}
