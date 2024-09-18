import * as React from "react";
import { ReactNode } from "react";

const Button = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <button
        style={{
          padding: 10,
          backgroundColor: "blue",
          color: "white",
          border: "none",
          borderRadius: 5,
          cursor: "pointer",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {children}
      </button>
    </>
  );
};

export { Button };
