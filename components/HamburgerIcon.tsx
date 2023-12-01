import { useTheme } from "next-themes";
import React, { useState } from "react";

const HamburgerIcon = ({ isOpen }: { isOpen: boolean }) => {
  const {theme} = useTheme()
  const classStirng = "absolute left-0 w-6 h-1 bg-primary rounded-full duration-500 origin-[left center]";

  return (
    <div className="fit-content p-3 gap-0.5 flex flex-col relative">
      <div className={`${classStirng} transition-all ${isOpen ? "rotate-45 top-2": "rotate-0 top-0"}`}></div>
      <div className={`${classStirng} top-2 left-0 transition-opacity ${isOpen ? "hidden" : 'block'}`}></div>
      <div className={`${classStirng} transition-all ${isOpen ? "-rotate-45 top-2": "rotate-0 top-4"}`}></div>
    </div>
  );
};

export default HamburgerIcon;
