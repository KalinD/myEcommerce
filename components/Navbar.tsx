import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import React, { useRef, useState } from "react";
import NavLink from "./NavLink";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
  const { count } = useCart();
  const { data: session } = useSession();
  const mobileClasses = `ease-in-out duration-300 bottom-0 px-5 pt-12 flex-col justify-start  ${
    open && isMobile ? "translate-x-0" : "translate-x-full"
  }`;
  const desktopClasses = `left-0 flex-row justify-end px-5`;

  return (
    <div>
      {isMobile && (
        <div className="fixed z-50 top-2 right-2 cursor-pointer">
          {open ? (
            <Image
              src="/icons/close.png"
              alt="close menu"
              width={32}
              height={32}
              onClick={() => setOpen(false)}
            />
          ) : (
            <Image
              src="/icons/menu.png"
              alt="open menu"
              width={32}
              height={32}
              onClick={() => setOpen(true)}
            />
          )}
        </div>
      )}
      <div
        className={`fixed z-40 bg-background bg-opacity-30 flex gap-2 md:gap-4 backdrop-blur-lg top-0 right-0 ${
          isMobile ? mobileClasses : desktopClasses
        }`}
      >
        {session?.user.role === "ADMIN" && (
          <NavLink onClick={() => setOpen(false)} href="/products">
            Products
          </NavLink>
        )}
        <NavLink href={"/"} onClick={() => setOpen(false)}>
          Home
        </NavLink>
        {!session && (
          <>
            <NavLink href={"/login"} onClick={() => setOpen(false)}>
              Login
            </NavLink>
            <NavLink href={"/register"} onClick={() => setOpen(false)}>
              Register
            </NavLink>
          </>
        )}
        <NavLink
          href={"/cart"}
          onClick={() => setOpen(false)}
          className="pr-8 relative hover-underline-animation p-2 text-lg md:text-xl"
        >
          Cart{" "}
          {count > 0 ? (
            <span className="absolute right-0 rounded-full h-fit bg-accent text-white px-2 text-center">
              {count}
            </span>
          ) : (
            ""
          )}
        </NavLink>
        {session && (
          <>
            <NavLink
              onClick={() => {
                setOpen(false);
                signOut();
              }}
            >
              Logout
            </NavLink>
            <NavLink
              href={`/user/${session.user.username}`}
              onClick={() => setOpen(false)}
            >
              User
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
