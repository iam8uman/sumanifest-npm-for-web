import * as React from "react";
import { ReactNode, CSSProperties } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
  disabled?: boolean;
}

const defaultStyle: CSSProperties = {
  padding: 10,
  backgroundColor: "blue",
  color: "white",
  border: "none",
  borderRadius: 5,
  cursor: "pointer",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  transition: "background-color 0.3s ease",
};

const Button: React.FC<ButtonProps> = ({ children, onClick, style, disabled }) => {
  return (
    <button
      onClick={onClick}
      style={{ ...defaultStyle, ...style }}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export { Button };