import React, { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  role?: string;
};

const Button = ({
  children,
  onClick,
  role = "button",
  className = "",
}: ButtonProps) => {
  return (
    <button
      role={role}
      className={
        className
          ? className
          : "bg-primary text-white px-2 py-1 md:py-2 md:px-3 lg:px-4 rounded-full"
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
