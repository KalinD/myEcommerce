import React, { ReactNode } from "react";
import { twMerge } from 'tailwind-merge'

type ButtonProps = {
  children: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean
  role?: string;
};

const Button = ({
  children,
  onClick,
  role = "button",
  className = "",
  disabled = false
}: ButtonProps) => {
  return (
    <button
      role={role}
      disabled={disabled}
      className={twMerge("bg-primary text-white px-2 py-1 md:py-2 md:px-3 lg:px-4 rounded-full", className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
