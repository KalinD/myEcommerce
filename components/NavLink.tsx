import Link from "next/link";
import React, { ReactNode } from "react";

type NavLinkProp = {
  href?: string;
  children: ReactNode;
  className?: string;
  onClick: () => void;
};

const NavLink = ({ href, children, onClick, ...rest }: NavLinkProp) => {
  const classes = "hover-underline-animation p-2 text-lg md:text-xl cursor-poitner";
  if (href) {
    return (
      <li className="list-none">
        <Link className={classes} onClick={onClick} href={href} {...rest}>
          {children}
        </Link>
      </li>
    );
  }
  return (
    <div className={classes} onClick={onClick} {...rest}>
      {children}
    </div>
  );
};

export default NavLink;
