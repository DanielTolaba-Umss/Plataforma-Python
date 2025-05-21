// src/components/ui/Button.jsx
import React from "react";
import "/src/estilos/Button.css";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
}) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick} type={type}>
      {children}
    </button>
  );
};

export default Button;
