import { useCart } from "@/context/CartContext";
import React, { useEffect, useRef, useState } from "react";
import NavLink from "./NavLink";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";
import { signOut, useSession } from "next-auth/react";
import ThemeProvider, { useTheme } from "next-themes";
import HamburgerIcon from "./HamburgerIcon";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
  const { setTheme } = useTheme();
  const [themeString, setThemeString] = useState<"Light" | "Dark">("Dark");
  const { count } = useCart();
  const { data: session } = useSession();
  const mobileClasses = `ease-in-out duration-300 bottom-0 px-5 py-12 flex-col justify-start ${
    isOpen && isMobile ? "translate-x-0" : "translate-x-full"
  }`;
  const desktopClasses = `left-0 flex-row justify-between px-5`;
  const { tryToLoadFromCookies } = useCart();

  useEffect(() => {
    tryToLoadFromCookies();
    setTheme("dark")
  }, []);

  useEffect(() => {
    setTheme(themeString == "Dark" ? "light" : "dark");
  }, [themeString]);

  return (
    <nav>
      {isMobile && (
        <div onClick={() => setIsOpen(!isOpen)}  className="fixed z-50 top-2 right-2 cursor-pointer">
          <HamburgerIcon isOpen={isOpen}/>
        </div>
      )}
      <ul
        className={`fixed z-40 bg-background bg-opacity-30 gap-2 flex md:gap-4 backdrop-blur-lg top-0 right-0 ${
          isMobile ? mobileClasses : desktopClasses
        }`}
      >
        <div className="self-start flex flex-col md:flex-row gap-2">
          <NavLink href={"/"} onClick={() => setIsOpen(false)}>
            Home
          </NavLink>
          {session?.user.role === "ADMIN" && (
            <NavLink onClick={() => setIsOpen(false)} href="/products">
              Products
            </NavLink>
          )}
          {session?.user.role !== "ADMIN" && (
            <NavLink
              href={"/cart"}
              onClick={() => setIsOpen(false)}
              className="pr-8 relative hover-underline-animation p-2 text-lg md:text-xl"
            >
              Cart{" "}
              {count > 0 ? (
                <span className="absolute right-0 rounded-full h-fit w-fit bg-primary text-white px-2 text-center">
                  {count}
                </span>
              ) : (
                ""
              )}
            </NavLink>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <div
            className="hover-underline-animation p-2 text-lg md:text-xl cursor-pointer"
            onClick={() =>
              setThemeString((old) => (old == "Light" ? "Dark" : "Light"))
            }
          >
            {themeString} Mode
          </div>
          <NavLink href="/about" onClick={() => setIsOpen(false)}>
            About
          </NavLink>
          {!session && (
            <>
              <NavLink href={"/login"} onClick={() => setIsOpen(false)}>
                Login
              </NavLink>
              <NavLink href={"/register"} onClick={() => setIsOpen(false)}>
                Register
              </NavLink>
            </>
          )}

          {session && (
            <>
              <NavLink
                onClick={() => {
                  setIsOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
              >
                Logout
              </NavLink>
              <NavLink
                href={`/user/${session.user.username}`}
                onClick={() => setIsOpen(false)}
              >
                User
              </NavLink>
            </>
          )}
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
